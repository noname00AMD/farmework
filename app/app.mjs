"use strict";
import Debug from "./debug.mjs"
import Router from "./router/router.mjs"
import request from "./request.mjs"
import response from "./response.mjs"
import application from "./application.mjs"
import events from "events"
const EventEmitter = events.EventEmitter
const debug = Debug("app")


var createApp = function () {
    var app = function (req, res, next) {
        app.handle(req , res , next)
    }
    Object.assign(app , EventEmitter.prototype)
    Object.assign(app , application)
    app.req = Object.create(request, { app: { configurable: false, enumerable: false, writable: false, value: request } })
    app.res = Object.create(response, { app: { configurable: false, enumerable: false, writable: false, value: response } })
    app.Router = Router
    return app;
}


export default createApp
