import Stream from 'stream';
import path from 'path'
import Url from 'url'



export default function serveStatic (root, opts) {
    if (typeof root !== 'string') {
        throw new TypeError('root path must be a string')
    }
    var opts = Object.create(options || null)
    opts.maxage = opts.maxage || opts.maxAge || 60 * 60 * 2 * 1000 // 2 hours
    acceptRanges = opts.acceptRanges || true
    cacheControl = opts.cacheControl || true
    etag = opts.etag || true
    dotfiles = opts.dotfiles || 'ignore'
    lastModified = opts.lastModified || true
    return function (req, res, next) {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next()
        }
        var _req_url = new Url.URL(req_url, SITE_URL)
        this.pathname = _req_url.pathname;
        Stream.call(this)

    }
}
