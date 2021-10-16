'use strict';
import url from "url";
import util from "util";
import Debug from "../debug.mjs";
import pathToRegexp from "../path-to-regexp.mjs";
var debug = Debug("app:layer");
const SITE_URL = process.env.SITE_URL


class Layer {
    constructor(path, opts = {}, fn) {
        debug(`new layer path  ${util.inspect(path)}`)

        // set up  layer
        this.fn = fn
        this.name = fn.name || '<anonymous>';
        this.params = {};
        this.keys = []
        this.path = undefined;
        this.methods = []
        // exec  path

        // if (path instanceof RegExp) throw new TypeError(`path must be string , given ${util.inspect(path)}`)
        if ((path === "/" || path === "*") && opts.end === false) {
            this.regexp = new RegExp("^.$", "gi")
        } else {
            this.regexp = pathToRegexp(path, this.keys, opts)
        }
        debug(`new layer keys  ${util.inspect(this.keys)}`)
        debug(`new layer regexp ${this.regexp} `)
    }


    handle_err(error, req, res, next) {
        var fn = this.handle
        if (fn.length !== 4) {
            // not a standard error handler
            return next(error);
        }
        try {
            fn(error, req, res, next);
        } catch (err) {
            next(err);
        }
    }


    handle_req(req, res, next) {
        var fn = this.fn;
        if (fn.length > 3) {
            // not a standard request handler
            return next();
        }
        try {
            fn(req, res, next);
        } catch (err) {
            next(err);
        }
    }


    match(req_url) {
        var _req_url = new url.URL(req_url, SITE_URL)
        debug(`${this.name} layer matching ${_req_url}`)
        var match
        if (_req_url.pathname != null) {
            match = this.regexp.exec(_req_url.pathname)
            debug(`match :${match} `)

        }
        if (!match) {
            this.params = undefined;
            this.path = undefined;
            debug(`--${this.name} layer return false`)
            return false;
        }
        this.path = match[0]
        var params = this.params
        var keys = this.keys
        try {
            for (let i = 1; i < match.length; i++) {
                var key = keys[i - 1];
                params[key.name] = decodeURIComponent(match[i])
                debug(`macth params ${i} : ${key.name} : ${match[i]}`)
            }
        } catch (err) {
            if (err instanceof URIError) {
                err.message = 'Failed to decode param \'' + val + '\'';
                err.status = err.statusCode = 400;
            }
            throw err;
        }
        debug(`${this.name} return true , params ${util.inspect(this.params)}`)
        return true;
    }


    options() {
        var methods = [...this.methods]
        if (methods.includes("get") && !methods.includes("head")) {
            methods.push("head")
        }
        return methods;
    }
    dispatch(req, res, next) {

    }
}
export default Layer
