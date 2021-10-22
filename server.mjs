// debugger;
import "./config.mjs"
import app from './app.mjs'
import Debug from "./app/debug.mjs"
import http from "http"
var debug = Debug("server")
var port = (process.env.PORT || 5000);

var server = http.createServer({
    IncomingMessage: http.IncomingMessage,
    ServerResponse: http.ServerResponse,
    insecureHTTPParser: false,
    maxHeaderSize: 16384 // 16kb
} , app);

server.listen(port, '0.0.0.0');
server.on('error', onError);
server.on('listening', onListening);
server.requestTimeout = 8000 // req >8s server will return 408 code

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
