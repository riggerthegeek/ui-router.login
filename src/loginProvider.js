/**
 * login
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {_} from "lodash";


/* Files */


export default function () {


    /**
     * Config params
     */

    let authModule = "$authentication";
    let authClearMethod = "clearAuthKey";
    let authGetMethod = "getAuthKey";
    let cookieName = "__loginData";
    let defaultLoggedInState = null;
    let fallbackState = null;


    /**
     * Login
     */
    class Login {


        /**
         * Constructor
         *
         * Sets the DI modules to this class
         *
         * @param {object} $authentication
         * @param {object} ipCookie
         * @param {object} $state
         */
        constructor ($authentication, ipCookie, $state) {

            this._$authentication = $authentication;
            this._ipCookie = ipCookie;
            this._$state = $state;

        }


        /**
         * Check Logged In
         *
         * Checks if we're logged in. If not, it
         * goes to the fallback state.
         *
         * You shouldn't save any state that will
         * cause an infinite loop (such as the logout
         * state)
         *
         * @param {string} currentState
         * @param {object} currentParams
         * @param {boolean} saveCurrentState
         * @returns {promise|IPromise<any>|void}
         */
        checkLoggedIn (currentState, currentParams, saveCurrentState = true) {

            if (this.isLoggedIn() === false) {

                /* Not logged in - save current state in case we log in later */
                if (saveCurrentState === true) {

                    let value = {
                        state: currentState,
                        params: currentParams
                    };

                    this._ipCookie(cookieName, value, {
                        path: "/"
                    });

                }

                /* Now, send to the fallback state */
                return this._$state.go(fallbackState);

            }

        }


        /**
         * Get Login Redirect
         *
         * Redirects to the logged in part of the site.
         *
         * @returns {promise|IPromise<any>|void}
         */
        getLoginRedirect () {

            let cookie = this._ipCookie(cookieName);
            if (_.isPlainObject(cookie) === false) {
                /* Something has gone wrong */
                cookie = {};
            }

            let state = cookie.state;
            let params = cookie.params;

            if (_.isPlainObject(params) === false) {
                params = {};
            }

            if (!state) {
                /* No redirect information - go to default page */
                state = defaultLoggedInState;
            }

            /* Perform the redirect */
            return this._$state.go(state, params, {
                reload: true
            });

        }


        /**
         * Is Logged In
         *
         * Are we logged in?
         *
         * @returns {boolean}
         */
        isLoggedIn () {

            try {
                /* Is the result true? */
                return !!this._$authentication[authGetMethod]();
            } catch (err) {
                /* Throw the error with the correct module and method names */
                throw new Error(authModule + "." + authGetMethod + "() is not a function");
            }

        }


        /**
         * Logout
         *
         * Logs out from the system and then redirects. If
         * it's a string, it goes to that state. If it's
         * true, it goes to fallback state. If empty, it
         * reloads the page
         *
         * @param {string|boolean} redirectState
         * @returns {*}
         */
        logout (redirectState = null) {

            /* Clear the auth key */
            try {
                this._$authentication[authClearMethod]();
            } catch (err) {
                /* Throw the error with the correct module and method names */
                throw new Error(authModule + "." + authClearMethod + "() is not a function");
            }

            if (redirectState === true) {
                /* Go to fallback state */
                return this._$state.go(fallbackState, {}, {
                    reload: true
                });
            } else if (_.isString(redirectState)) {
                /* Go to specific state */
                return this._$state.go(redirectState, {}, {
                    reload: true
                });
            } else {
                /* Reload the page */
                return this._$state.reload();
            }

        }


    }


    /**
     * Config methods
     */


    /**
     * Set Auth Module
     *
     * Sets the authentication module to use. This
     * must be defined outside of this module.
     *
     * @param {string} module
     * @returns {*}
     */
    this.setAuthModule = (module) => {

        if (_.isString(module)) {
            authModule = module;
        }

        return this;

    };


    /**
     * Set Auth Clear Method
     *
     * Sets the clear method to use.  This is a
     * method inside the auth module - it will
     * receive no params and return nothing.
     *
     * @param {string} method
     * @returns {*}
     */
    this.setAuthClearMethod = (method) => {

        if (_.isString(method)) {
            authClearMethod = method;
        }

        return this;

    };


    /**
     * Set Auth Get Method
     *
     * Sets the get method to use.  This is a
     * method inside the auth module - it will
     * receive no params and return true or a
     * falsey result.
     *
     * @param {string} method
     * @returns {*}
     */
    this.setAuthGetMethod = (method) => {

        if (_.isString(method)) {
            authGetMethod = method;
        }

        return this;

    };


    /**
     * Set Cookie Name
     *
     * Sets the cookie name
     *
     * @param {string} name
     * @returns {*}
     */
    this.setCookieName = (name) => {

        if (_.isString(name)) {
            cookieName = name;
        }

        return this;

    };


    /**
     * Set Default Logged In State
     *
     * If we have just logged in an no previous
     * state is stored in a cookie, this is where
     * we get sent.
     *
     * This would typically be your profile page
     * or the starting point of an application.
     *
     * @param {string} state
     * @returns {*}
     */
    this.setDefaultLoggedInState = (state) => {

        if (_.isString(state) && _.isEmpty(state) === false) {
            defaultLoggedInState = state;
        }

        return this;

    };


    /**
     * Set Fallback State
     *
     * If we're trying to access a state that
     * requires authentication that we don't
     * have, this is where we are sent to gain
     * that authentication.
     *
     * This is typically a login state
     *
     * @param {string} state
     * @returns {*}
     */
    this.setFallbackState = (state) => {

        if (_.isString(state) && _.isEmpty(state) === false) {
            fallbackState = state;
        }

        return this;

    };


    this.$get = ($injector, ipCookie, $state) => {

        "ngInject";

        if (_.isNull(defaultLoggedInState)) {
            throw new Error("loginProvider.defaultLoggedInState must be set");
        }

        if (_.isNull(fallbackState)) {
            throw new Error("loginProvider.fallbackState must be set");
        }

        /* Load the dynamic authentication module */
        let $authentication = $injector.get(authModule);

        /* Return instance of the class */
        return new Login(
            $authentication,
            ipCookie,
            $state
        );

    };


}
