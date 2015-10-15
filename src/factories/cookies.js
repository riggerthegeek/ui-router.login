/**
 * cookies
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {_} from "lodash";


/* Files */


export default function (ipCookie) {

    "ngInject";


    let cookieOpts = (opts) => {

        opts = _.isObject(opts) ? opts : {};

        return {
            domain: opts.domain || undefined,
            expires: opts.expires || undefined,
            expirationUnit: opts.expirationUnit || undefined,
            path: opts.path || "/",
            secure: opts.secure || false
        };

    };


    return class Cookies {


        static destroy (key, opts) {
            return ipCookie.remove(key, cookieOpts(opts));
        }


        static get (key) {
            return ipCookie(key);
        }


        static set (key, value, opts) {
            return ipCookie(key, value, cookieOpts(opts));
        }


    };

}
