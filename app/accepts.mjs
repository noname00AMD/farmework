'use strict'

import debug from("./debug")('app:accepts')

class Accepts {
    constructor(req) {
        if (!(this instanceof Accepts)) {
            return new Accepts(req)
        }
        this.headers = req.headers


    }
}
