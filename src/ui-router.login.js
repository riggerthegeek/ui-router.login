/**
 * app
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import "../bower_components/angular-cookie/angular-cookie.min.js";


var app = angular.module("ui.router.login", [
    "ipCookie",
    "ui.router"
])

    /* Providers */
    .provider("$login", require("./loginProvider"))

    /* Run */
    .run(require("./run"));


module.exports = app;
