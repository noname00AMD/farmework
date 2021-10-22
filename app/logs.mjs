
import { Buffer } from 'buffer'
export default function logger(opts = {}) {
    return function (req, res, next) {
        var color_code = {
            blue: 34,
            yellow: 33,
            red: 31,
            cyan: 36,
            green: 32,
            magenta: 35,
            white: 37,
            gray: 30
        }
        req._startAt = process.hrtime()
        req._startTime = new Date()

        res.on('finish', function () {
            req._startAt = process.hrtime()
            req._startTime = new Date()
            var str = `\n ${req.method} ${req.url}\x1b[34m ${this.statusCode}\x1b[89m \x1b[0mabc\n`
            var status = res.statusCode
            var color = status >= 500 ? 31 // red
                : status >= 400 ? 33 // yellow
                    : status >= 300 ? 36 // cyan
                        : status >= 200 ? 32 // green
                            : 0 // no color
            process.stdout.write(Buffer.from(str), function (err) {
                return false
            })
        })


        next()

    }
}
