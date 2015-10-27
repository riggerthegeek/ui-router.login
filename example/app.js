/**
 * app
 */


(function () {

    "use strict";

    angular
        .module("app", [
            "ui.router",
            "ui.router.login",
            "ui.router.stateHelper"
        ])
        .config(["stateHelperProvider", "$urlRouterProvider", function (stateHelperProvider, $urlRouterProvider) {

            stateHelperProvider
                .state({
                    name: "app",
                    url: "/",
                    abstract: true,
                    children: [{
                        /* Any pages that don't require login live here */
                        name: "public",
                        abstract: true,
                        children: [{
                            name: "login",
                            url: "login",
                            views: {
                                "content@": {
                                    template: "login",
                                    controllerAs: "vm"
                                }
                            },
                            children: [{
                                name: "process",
                                url: "/process",
                                views: {
                                    "content@": {
                                        template: "hello",
                                        controller: function ($authentication, $login) {
                                            /* Hardcode a login key */
                                            $authentication.setAuthKey("key");

                                            /* Do the login redirect */
                                            $login.getLoginRedirect();
                                        }
                                    }
                                }
                            }]
                        }]
                    }, {
                        /* Any pages that require login live under here */
                        name: "private",
                        abstract: true,
                        data: {
                            requireLogin: true
                        },
                        children: [{
                            name: "logout",
                            url: "logout",
                            data: {
                                saveState: false
                            },
                            views: {
                                "content@": {
                                    controller: function ($login) {
                                        return $login.logout(true);
                                    }
                                }
                            }
                        }, {
                            name: "home",
                            url: "",
                            views: {
                                "content@": {
                                    template: "homepage",
                                    controllerAs: "vm"
                                }
                            }
                        }]
                    }]
                });

            $urlRouterProvider.otherwise("/");

        }])
        .config(["$loginProvider", function ($loginProvider) {

            $loginProvider.setAuthModule("$authentication")
                .setAuthClearMethod("clearAuthKey")
                .setAuthGetMethod("getAuthKey")
                .setCookieName("__loginState")
                .setDefaultLoggedInState ("app.private.home")
                .setFallbackState("app.public.login");

        }])
        .factory("$authentication", ["ipCookie", function (ipCookie) {

            var cookieName = "authCookie";

            return {

                clearAuthKey: function () {
                    return ipCookie.remove(cookieName, {
                        path: "/"
                    });
                },

                getAuthKey: function () {

                    return !!ipCookie(cookieName);

                },

                setAuthKey: function (key) {

                    ipCookie(cookieName, key, {
                        path: "/"
                    });

                }

            };

        }]);

})();
