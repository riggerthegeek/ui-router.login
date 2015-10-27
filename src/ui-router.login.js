/**
 * app
 */

"use strict";


/* Node modules */


/* Third-party modules */
import "angular-cookie";


/* Files */


var app = angular.module("ui.router.login", [
    "ipCookie",
    "ui.router"
])

    /* Providers */
    .provider("$login", require("./loginProvider"))

    /* Run */
    .run(require("./run"));


module.exports = app;
