import url from "url";
import util from "util";
import Debug from "../debug.mjs";
import pathToRegexp from "../path-to-regexp.mjs";
import lib from 'path-to-regexp'
var debug = Debug("app");
const SITE_URL = process.env.SITE_URL


class Layer {
    constructor(path, opts = {}, fn) {

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
            this.regexp = new RegExp("^.+$", "i")
        } else {
            this.regexp = pathToRegexp(path, this.keys, opts)
        }
        debug(`layer - new path ${util.inspect(path)} regexp ${this.regexp} keys  ${util.inspect(this.keys)}`)
        debug(`layer - regexp lib ${lib.pathToRegexp(path)} `)
    }


    handle_err(error, req, res, next) {
        debug(`layer - handle_err`)
        var fn = this.fn
        if (fn.length !== 4) {
            // not a standard error handler
            return next(error);
        }
        fn(error, req, res, next);

    }


    handle_req(req, res, next) {
        debug(`layer - handle_err`)
        var fn = this.fn;
        if (fn.length !== 3) {
            // not a standard request handler
            return next(new Error('not a standard request handler'));
        }
        fn(req, res, next);
    }


    match(req_url) {

        var _req_url = new url.URL(req_url, SITE_URL)
        debug(` layer - match : ${_req_url}`)
        var match
        if (_req_url.pathname != null) {
            match = this.regexp.exec(_req_url.pathname)
            debug(`layer- regexp matched :${match} `)
        }
        if (!match) {
            this.params = undefined;
            this.path = undefined;
            return false;
        }
        this.path = match[0]
        var params = this.params
        var keys = this.keys
        try {
            for (let i = 1; i < match.length; i++) {
                var key = keys[i - 1];
                params[key.name] = decodeURIComponent(match[i])
            }
        } catch (err) {
            if (err instanceof URIError) {
                err.message = 'Failed to decode param \'' + val + '\'';
                err.status = err.statusCode = 400;
            }
            return err;
        }
        debug(`layer - ${this.name} return true , params ${util.inspect(this.params)}`)
        return true;
    }


}
export default Layer
