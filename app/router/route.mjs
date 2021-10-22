import Layer from "./layer.mjs"
import http from "http"
import Debug from "../debug.mjs"
var methods = http.METHODS
const debug = Debug("app")


class Route {
    constructor() {
        this.stack = []
        this.methods = []
    }
    has_method = function handles_method(method) {
        if (method === 'head' && !this.methods.includes('head')) {
            method = 'get';
        }
        return Boolean(this.methods.includes(method));
    }
    options() {
        debugger
        // append automatic head
        if (this.methods.includes('get') && !this.methods.includes('head')) {
            this.methods.push('head');
        }
        var methods
        this.methods.forEach(function (method) {
            methods.push(method.toUpperCase())
        })
        return methods;
    }
    dispatch(req, res, done) {
        var idx = 0;
        var stack = this.stack;
        if (stack.length === 0) {
            return done();
        }

        var method = req.method.toLowerCase();
        if (method === 'head' && !this.methods.includes('head')) {
            method = 'get';
        }
        next();
        function next(err) {
            if (err) {
                return done(err)
            }
            if (idx >= stack.length) {
                return done()
            }
            var layer = stack[idx++];
            if (!layer) {
                throw new Error('layer not exits')
            }

            if (!layer.methods.includes(method)) {
                return next();
            }

            if (err) {
                return layer.handle_err(err, req, res, next);
            }
            layer.handle_req(req, res, next);
        }
    }
    all(fns) {
        var fns = [...arguments]
        fns.forEach(function name(fn) {
            if (typeof fn !== 'function') {
                throw new Error('err of fn');
            }
            var layer = Layer('/', { end: true }, handle);
            layer.methods = methods
            this.stack.push(layer);
        })
    }
}

methods.forEach(function (method) {
    method = method.toLowerCase()
    Route.prototype[method] = function () {
        var fns = [...arguments]
        fns.forEach(function name(fn) {
            if (typeof fn !== 'function') {
                throw new Error(' must fn in array');
            }
            var layer = new Layer('/', { end: true }, fn);
            layer.methods.push(method)
            this.methods.push(method)
            this.stack.push(layer);
        }, this)
    }
})

export default Route
