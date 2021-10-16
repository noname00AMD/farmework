import Router from "./router/router.mjs"
import http from 'http';
import util from 'util';
import Debug from './debug.mjs'
import Layer from './router/layer.mjs'
import path from 'path'
const debug = Debug('app:application');
var resolve = path.resolve
var app = {};
var methods = http.METHODS

app.router = new Router()

app.mountpath = '/';

app.handle = function handle(req, res) {
    var router = this.router
    router.handle(req, res, app.lastHandle)
}


methods.forEach(function (method) {
    method = method.toLocaleLowerCase()
    app[method] = function (path) {
        var router = this.router
        if (typeof (path) !== "string") {
            // err
            throw new TypeError("first arg must be string")
        }
        // debugger
        var fns = Array.from(Array.prototype.slice.call(arguments, 1))
        fns.forEach(function (fn) {
            if (typeof fn !== "function") {
                // err
                throw new TypeError("first arg must be func")
            }
            router[method].apply(router, [path, fn])
        })
    }
})
app.all = function (path) {
    var router = this.router
    if (typeof (path) !== "string") {
        // err
        throw new TypeError("first arg must be string")
    }
    var fns = Array.from(Array.prototype.slice.call(arguments, 1))
    methods.forEach(function (method) {
        method = method.toLocaleLowerCase()
        fns.forEach(function (fn) {
            if (typeof fn !== "function") {
                throw new TypeError("2 arg must be funct")
            }
            router[method].apply(router, [path, fn])
        })
    })
}
app.use = function (fn) {
    var path = '/';
    if (typeof (fn) !== "function" && !Array.isArray(fn)) {
        // err
        throw new TypeError("first arg must be func")
    }
    if (!Array.isArray(fn)) {
        var fns = [...arguments]
    } else {
        var fns = arguments
    }
    fns.forEach(function (fn ) {
        if (typeof fn !== "function") {
            throw new TypeError(`router require callback func but given ${typeof fn}`)
        }
        fn.mountpath = path;
        fn.parent = this;
        this.router.use(path, function mounted(req, res, next) {
            var orig_req = app.req
            var orig_res = app.res
            fn(req, res, function (err) {
                req = orig_req;
                res = orig_res;
                next(err)
            })
        })
    } , this)

}
app.path = function path() {
    return this.parent
        ? this.parent.path() + this.mountpath
        : '';
};

app.lastHandle = function (err, req, res) {
    var env = process.env.NODE_ENV || 'development'
    console.log(`lasthandle development : ${util.inspect(err)}`);
    res.end('<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '<meta charset="utf-8">\n' +
        '<title>Error</title>\n' +
        '</head>\n' +
        '<body>\n' +
        '<h1>' + env + '</h1>\n' +
        '<pre>' + util.inspect(err) + '</pre>\n' +
        '</body>\n' +
        '</html>\n')

}





// this.on('mount', function onmount(parent) {
//     // inherit protos
//     setPrototypeOf(this.req, parent.req)
//     setPrototypeOf(this.res , parent.res)
//     setPrototypeOf(this.settings, parent.settings)












export default app
