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
        .config(function (stateHelperProvider, $urlRouterProvider) {

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
                            }
                        }]
                    }, {
                        /* Any pages that require login live under here */
                        name: "private",
                        abstract: true,
                        data: {
                            requireLogin: true
                        },
                        children: [{
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

        })
        .config(function ($loginProvider) {

            $loginProvider.setAuthModule("$authentication")
                .setAuthClearMethod("clearAuthKey")
                .setAuthGetMethod("getAuthKey")
                .setDefaultLoggedInState ("app.private.home")
                .setFallbackState("app.public.login");

        })
        .factory("$authentication", function () {

            return {

                getAuthKey: function () {

                    return null;

                }

            };

        });

})();
