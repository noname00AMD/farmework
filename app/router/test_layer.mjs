process.env.SITE_URL = 'http://localhost'

import Layer from "./layer.mjs";
import pathToRegexp from "../path-to-regexp.mjs";
var keys = []
function h(){}
var a = new Layer("/" , keys  , h)
console.log(a.regexp);
