
import ejs from 'ejs'
import logger from './app/logs.mjs'
import createApp from "./app/app.mjs"
import createError from "./app/http-error.mjs"

var app = createApp()
app.use(logger())
app.get("/", function name(req, res, next) {
    res.end("ok")

})
app.get("/test/:id", function name(req, res, next) {
    res.end("test")

})

app.use(function (req, res, next) {
    next(createError('notfound'));
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err);
    res.writeHead(err.status || 500);
    ejs.renderFile('./views/error.ejs', { error: err }, { cache: true } , function name(error , html) {
        if (error) {
           return next(error)
        }
        res.end(html)
    });
});

export default app
