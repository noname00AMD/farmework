'use strict'

import Debug from './debug.mjs'
import path from 'path'
const debug = Debug('app:request');
import net from 'net';
const isIP = net.isIP;
import http from 'http';
import mime from "./mime.mjs"

var req = Object.create(http.IncomingMessage.prototype)

req.accepts = function (types) {
    return ""
};


req.acceptsEncodings = function (encodings) {
    return ""
};

req.acceptsCharsets = function () {
    return ""

}

req.acceptsLanguages = function () {
    return ""
};

req.range = function range(size, options) {
    return ""
};

req.param = function param(name, defaultValue) {
    return ""
}

req.is = function is(types) {
    return ""
}

Object.defineProperty(req, "protocol", {
    get: function protocol() {

    }
})
Object.defineProperty(req, "secure", {
    get: function secure() {

    }
})
Object.defineProperty(req, "ip", {
    get: function ip() {

    }
})
Object.defineProperty(req, "ips", {
    get: function ips() {

    }
})
Object.defineProperty(req, "subdomains", {
    get: function subdomains() {

    }
})
Object.defineProperty(req, "path", {
    get: function path() {

    }
})
Object.defineProperty(req, "hostname", {
    get: function hostname() {

    }
})
Object.defineProperty(req, "host", {
    get: function host() {

    }
})
Object.defineProperty(req, "fresh", {
    get: function fresh() {

    }
})
Object.defineProperty(req, "stale", {
    get: function stale() {

    }
})
Object.defineProperty(req, "xhr", {
    get: function xhr() {

    }
})


export default req
