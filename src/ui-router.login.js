/**
 * app
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import "../bower_components/angular-cookie/angular-cookie";


var app = angular.module("ui.router.login", [
    "ipCookie"
])

    /* Providers */
    .provider("$login", require("./loginProvider"))

    /* Run */
    .run(require("./run"));


module.exports = app;
