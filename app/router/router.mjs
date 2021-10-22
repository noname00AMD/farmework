import Layer from "./layer.mjs"
import http from "http"
import Debug from "../debug.mjs"
import Route from "./route.mjs"


var methods = http.METHODS
const debug = Debug("app")

class Router {
    constructor() {
        this.stack = []

    }
    handle(req, res, lastHandle) {
        debug('layer - handle url %s', req.url);
        var _lastHandle = lastHandle.bind()
        var i = 0
        var stack = this.stack

        var method = req.method.toLowerCase()
        var parentParams = req.params;
        var parentUrl = req.baseUrl || '';
        // only used if OPTIONS request
        var options = [];
        if (method === 'options') {
            lastHandle = function resOptionsMethod() {
                try {
                    res.writeHead(200, {
                        "Allow": options.join(","),
                        'Transfer-Encoding': 'chunked'
                    })
                    res.end(options.join(","))
                } catch (err) {
                    _lastHandle(err)
                }
            }
        }
        next()
        function next(err) {
            if (i >= stack.length) {
                err = new Error(404)
                setImmediate(lastHandle, err);
                return;
            }
            var layer,
                match = false;
            while (match !== true && i < stack.length) {
                layer = stack[i++];
                if (err) {
                    match = true
                    continue
                }
                match = layer.match(req.url)
                if (typeof match !== 'boolean') {
                    // hold on to layerError
                    err = match;
                    break;
                }
             
                if (match !== true) {
                    continue;
                }
                if (!layer.route) {
                    continue;
                }
                var has_method = layer.route.has_method(method)
                if (!has_method && method === 'options') {
                    options = options.concat(layer.route.options())
                    continue;
                }
                if (!has_method && method !== 'head') {
                    match = false;
                    continue;
                }
            }
            if (match !== true) {
                return lastHandle(err);
            }
            // req.params = layer.params need edit  merge params
            if (err) {
                debug(`router - layer.handle_err()`)
                return layer.handle_err(err , req , res , next)
            }
            layer.handle_req(req, res, next)
        }

    }
    use() {
        var fns = [...arguments]
        fns.forEach(function name(fn) {
            var layer = new Layer("/", { end: false }, fn)
            layer.route = undefined
            this.stack.push(layer)
        } , this)
    }
    all(path) {
        var fns = Array.from(Array.prototype.slice.call(arguments, 1))
        var route = new Route(path)
        var layer = new Layer(path, {
            sensitive: true,
            strict: true,
            end: true
        }, route.dispatch.bind(route))
        layer.route = route
        this.stack.push(layer)
        route.all.apply(route, fns)
    }
}
methods.forEach(function (method) {
    method = method.toLocaleLowerCase()
    Router.prototype[method] = function (path) {
        if (typeof (path) !== "string") {
            // err
            throw new TypeError("first arg must be string")
        }
        var fns = Array.from(Array.prototype.slice.call(arguments, 1))
        var route = new Route(path)
        var layer = new Layer(path, {
            sensitive: true,
            strict: true,
            end: true
        }, route.dispatch.bind(route))
        layer.route = route
        this.stack.push(layer)
        route[method].apply(route, fns)
    }
})
export default Router
