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

        /* Ensure that pages that require a login actually have logged in */
        let requireLogin = _.has(toState, ["data", "requireLogin"]) && toState.data.requireLogin === true;

        if (requireLogin && $login.isLoggedIn() === false) {

            /* We need to be logged in but we're not - save current place */
            $login.checkLoggedIn(toState.name, toParams, toState.data.saveState);

            event.preventDefault();

        }

    });

}
