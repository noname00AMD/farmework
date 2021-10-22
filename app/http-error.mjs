import codes from './codes.mjs'

export default function createError(code) {
    var err , status ,message
    if (code instanceof Error) {
        err = code;
        status = err.status || err.statusCode || 500 // retry
    }else if (typeof code ==='string') {
        message = code
        status =  500
    }else if (typeof code ==='number') {
        status = code
        message = codes[status] || codes[String(status).charAt(0)+"00"]
    }
    if (!err) {
        // create error
        err =  new Error(message || HttpError)
        Error.captureStackTrace(err, createError)
    }
    err.status = err.statusCode = status
    return err
}
