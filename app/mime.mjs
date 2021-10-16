'use strict'

import path from 'path';
import fs from 'fs';
import types from "./types.mjs"
import Debug from "./debug.mjs"
const debug = Debug('app:mine')
class Mime {
    constructor() {
        this.types = {}
        this.extensions = {}
    }
    define(map) {
        for (var type in map) {
            var exts = map[type];
            for (var i = 0; i < exts.length; i++) {
                if (process.env.DEBUG_MIME && this.types[exts[i]]) {
                    console.warn((this._loading || "define()").replace(/.*\//, ''), 'changes "' + exts[i] + '" extension type from ' +
                        this.types[exts[i]] + ' to ' + type);
                }
                this.types[exts[i]] = type;
            }

            // Default extension is the first one we encounter
            if (!this.extensions[type]) {
                this.extensions[type] = exts[0];
            }
        }
    }
    lookup(path, fallback) {
        var ext = path.replace(/^.*[\.\/\\]/, '').toLowerCase();
        return this.types[ext] || fallback || this.default_type;
    }
}
var mime = new Mime()
mime.define(types)
mime.default_type = mime.lookup('bin');
mime.Mime = Mime;

mime.charsets = {
    lookup: function (mimeType, fallback) {
        // Assume text types are utf8
        return (/^text\/|^application\/(javascript|json)/).test(mimeType) ? 'UTF-8' : fallback;
    }
};
export default mime;
