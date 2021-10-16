"use strict";

import createApp from "./app/app.mjs"
var app = createApp()

app.get("/", function name(req, res, next) {
    res.end("ok")
})
app.options("/", function name(req, res, next) {
    res.end("hi")
    
})

export default app
