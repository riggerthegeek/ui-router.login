/**
 * run
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {_} from "lodash";


/* Files */


export default function ($rootScope, $state, $login) {

    "ngInject";

    $rootScope.$on("$stateChangeStart", (event, toState, toParams) => {

        /* Ensure that pages that require a login actually have logged in - ui.router inherits */
        var requireLogin = false;

        try {
            let tmp = toState.data.requireLogin;

            if (_.isBoolean(tmp)) {
                requireLogin = tmp;
            }
        } catch (err) {
            /* Ignore errors if param doesn't exist */
        }

        if (requireLogin && $login.isLoggedIn() === false) {

            /* We need to be logged in but we're not - save current place */
            $login.checkLoggedIn(toState.name, toParams, toState.data.saveState);

            event.preventDefault();

        }

    });

}
