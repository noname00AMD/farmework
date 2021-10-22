import http from 'http';
import path from 'path';
import Debug from './debug.mjs'
const debug = Debug('app:response');
var  resolve = path.resolve;

var charsetRegExp = /;\s*charset\s*=/;



var res = Object.create(http.ServerResponse.prototype)


res.status = function status(code) {

};

res.links = function (links) {

};

res.send = function send(body) {

}


res.json = function json(obj) {

}

res.jsonp = function jsonp(obj) {
}

res.sendStatus = function sendStatus(statusCode) {

}

res.sendFile = function sendFile(path, options, callback) {

}

res.download = function download(path, filename, options, callback) {

}


res.contentType = res.type = function contentType(type) {

}

res.format = function (obj) {

}

res.attachment = function attachment(filename) {

}

res.append = function append(field, val) {

}


res.set = res.header = function header(field, val) {

}

res.get = function (field) {

}

res.clearCookie = function clearCookie(name, options) {


}

res.cookie = function (name, value, options) {

}

res.redirect = function redirect(url) {

}

res.vary = function (field) {

}

res.render = function render(view, options, callback) {

}




export default res
