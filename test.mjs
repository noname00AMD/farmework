import "./config.mjs"
import http from "http"
import url from "url"
import Layer from "./app/router/layer.mjs"
var server = http.createServer(
    function (req, res) {
        var layer = new Layer("/", {},function test(req, res, next) {
            res.end("ok")
        })
        // console.log(req);
        layer.match(req.url) ?
            layer.handle_req(req, res)
            :
            res.end("error")
    }
).listen(3000)
