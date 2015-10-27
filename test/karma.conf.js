/**
 * karma.conf
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


module.exports = function (karma) {

    var config = {

        autoWatch: false,

        basePath: "../",

        browserify: {
            debug: true,
            transform: [
                "babelify"
            ]
        },

        browsers: [
            "PhantomJS",
            "Firefox"
        ],

        files: [
            "node_modules/angular/angular.js",
            "src/ui-router.login.js",
            "node_modules/angular-mocks/angular-mocks.js",
            "test/unit/**/*.js"
        ],

        frameworks: [
            "browserify",
            "mocha",
            "chai",
            "chai-sinon"
        ],

        preprocessors: {
            "src/ui-router.login.js": [
                "browserify"
            ],
            "test/unit/**/*.js": [
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
