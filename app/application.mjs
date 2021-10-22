import Router from "./router/router.mjs"
import Http from 'http';
import Util from 'util';
import Debug from './debug.mjs'
var SITE_URL = process.env.SITE_URL
const debug = Debug('app');
var app = {};
var methods = Http.METHODS

app.router = new Router()


app.handle = function handle(req, res) {
    var router = this.router
    router.handle(req, res, app.lastHandle(req , res))
}


methods.forEach(function (method) {
    method = method.toLocaleLowerCase()
    var router = this.router
    app[method] = function (path) {
        if (typeof (path) !== "string") {
            // err
            throw new TypeError("first arg must be string")
        }
        var fns = Array.from(Array.prototype.slice.call(arguments, 1))
        fns.forEach(function name(fn) {
            if (typeof fn !== "function") {
                // err
                throw new TypeError("first arg must be func")
            }
        })
        router[method].apply(router, [...arguments])
    }
},app)



app.all = function (path) {
    var router = this.router
    if (typeof (path) !== "string") {
        // err
        throw new TypeError("first arg must be string")
    }
    var fns = Array.from(Array.prototype.slice.call(arguments, 1))
    fns.forEach(function name(fn) {
        if (typeof fn !== "function") {
            // err
            throw new TypeError("first arg must be func")
        }
    })
    router.all.apply(router, [...arguments])
}
app.use = function (fn) {
    var path = '/';
    var router = this.router
    var fns = [...arguments]
    fns.forEach(function name(fn) {
        if (typeof fn !== "function") {
            // err
            throw new TypeError("first arg must be func")
        }
    })
    router.use.apply(router, [...arguments])

}

app.lastHandle = function lastHandle(req, res) {
    var env = process.env.NODE_ENV || 'development'
    return function (err) {
        console.log(`lasthandle development : ${Util.inspect(err)}`);
        res.writeHead(404)
        res.end('<!DOCTYPE html>\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '<meta charset="utf-8">\n' +
            '<title>Error</title>\n' +
            '</head>\n' +
            '<body>\n' +
            '<h1>' + env + '</h1>\n' +
            '<pre>' + Util.inspect(err) + '</pre>\n' +
            '</body>\n' +
            '</html>\n')
    }

}





// this.on('mount', function onmount(parent) {
//     // inherit protos
//     setPrototypeOf(this.req, parent.req)
//     setPrototypeOf(this.res , parent.res)
//     setPrototypeOf(this.settings, parent.settings)











export default app
