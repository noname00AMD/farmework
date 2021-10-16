import Layer from "./layer.mjs"
import http from "http"
import Debug from "../debug.mjs"


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
            var layerError = err === 'route'
                ? null
                : err;
            if (layerError === 'router') {
                setImmediate(lastHandle, err)
                return
            }
            if (i >= stack.length) {
                setImmediate(lastHandle, layerError);
                return;
            }
            var layer,
                match = false;
            // debugger
            while (match !== true && i < stack.length) {
                // debugger
                layer = stack[i++];
                match = layer.match(req.url)
                if (typeof match !== 'boolean') {
                    // hold on to layerError
                    layerError = layerError || match;
                }
                if (match !== true) {
                    continue;
                }
                if (layer.methods.length === 0) {
                    continue
                }
                if (layerError) {
                    match = false;
                    continue;
                }
                var has_method = layer.methods.includes(method)
                if (!has_method && method === 'options') {
                    options = options.concat(layer.options())
                    continue;
                }
                if (!has_method && method !== 'head') {
                    match = false;
                    continue;
                }
            }
            if (match !== true) {
                return lastHandle(layerError, req, res);
            }
            // req.params = layer.params need edit  merge params
            if (layerError) {
                layer.handle_err(layerError, req, res, next)
            }
            try {
                layer.handle_req(req, res, next)
            } catch (error) {
                next(error)
            }
        }

    }
}



methods.forEach(function (method) {
    method = method.toLocaleLowerCase()
    Router.prototype[method] = function (path, fn) {
        if (typeof (path) !== "string" || typeof fn !== "function") {
            // err
            throw new TypeError("first arg must be string , 2 must be func")
        }
        var layer = new Layer(path, { end: true }, fn)
        layer.methods.push(method)
        this.stack.push(layer)
    }
})
Router.prototype.use = function (fn) {
    if (typeof (fn) !== "function") {
        // err
        throw new TypeError("first arg must be func")
    }
    var layer = new Layer("/", { end: false }, fn)
    // layer.methods.push(method) is middleware method will be empty
    this.stack.push(layer)
}
export default Router
