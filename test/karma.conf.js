/**
 * karma.conf
 */

"use strict";


/* Node modules */
var os = require("os");


/* Third-party modules */


/* Files */


module.exports = function (karma) {

    var config = {

        autoWatch: false,

        browserify: {
            debug: true,
            transform: [
                "babelify",
                "brfs"
            ]
        },

        browsers: [
            "PhantomJS",
            "Firefox"
        ],

        files: [
            "../node_modules/angular/angular.js",
            "../src/ui-router.login.js",
            "../node_modules/angular-mocks/angular-mocks.js",
            "unit/**/*.js"
        ],

        frameworks: [
            "browserify",
            "mocha",
            "chai",
            "chai-sinon"
        ],

        preprocessors: {
            "../src/ui-router.login.js": [
                "browserify"
            ],
            "unit/**/*.js": [
                "browserify"
            ]
        },

        reporters: [
            "mocha"
        ],

        singleRun: true

    };

    return karma.set(config);

};
