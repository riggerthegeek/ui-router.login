# ui-router.login

[![NPM Version][npm-image]][npm-url]
[![Bower Version][bower-image]][bower-url]
[![Build Status][travis-image]][travis-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev Depedencies][dev-dependencies-image]][dev-dependencies-url]

A module which simplifies the login process to an Angular project that uses
[UI Router](http://angular-ui.github.io/ui-router/site/#/api/ui.router)

# Getting Started

From a high level perspective, this module works by telling the router that certain routes require authentication and
others don't.  One way that works quite well is to use the
[State Helper](https://github.com/marklagendijk/ui-router.stateHelper) plugin to create public and private groups. You
can do it without that, but these examples will assume use of State Helper as it's simpler to write.

## Include this module

Standard Angular include

    var app = angular.module("appName", [
        "ui.router.login",
        ...
    ];

## Define Your Routes

In your route config, define your routes.  In this example, we have a global parent which everything comes out of.

    app.config(function (stateHelperProvider) {

        stateHelperProvider
            .state({
                name: "app",
                url: "/",
                abstract: true,
                children: [{
                    /* Any pages that don't require authentication live here */
                    name: "public",
                    abstract: true,
                    children: [
                        /* States go here */
                    ]
                }, {
                    /* Any pages that do require authentication live here */
                    name: "private",
                    abstract: true,
                    data: {
                        requireLogin: true /* This is what tells it to require authentication */
                    },
                    children: [{
                        name: "logout",
                        url: "logout",
                        data: {
                            saveState: false /* Prevents $login module from saving this state */
                        },
                        views: {
                            "content@": {
                                controller: function ($login) {
                                    return $login.logout(true); /* Log out of system and redirect to login state */
                                }
                            }
                        }
                    }
                        /* Further states go here */
                    ]
                }]
            });

    });

In order to tell the module that it expects a state to have authentication in order to view it, you need to set
`requireLogin: true` inside the `data`.

Next, you need to configure the module.  The only two things that are required are to set the fallback state and the
default logged in state.  The rest have (hopefully) sensible defaults that can be used.

    app.config(function ($loginProvider) {

        $loginProvider
            .setDefaultLoggedInState ("app.private.home")
            .setFallbackState("app.public.login")
            .setAuthModule("$authentication")
            .setAuthClearMethod("clearAuthKey")
            .setAuthGetMethod("getAuthKey")
            .setCookieName("__loginState");

    });

### Config Options

#### setDefaultLoggedInState (string: state)

This is the state that we go to by default when we first log in. This will be overridden if the user has tried to go to
a private state whilst not logged in

#### setFallbackState (string: state)

This is the state we go to if we've tried to go to a private state and are not authorised. Typically, this would be
where your login page is.

#### setAuthModule (string: moduleName = "$authentication")

This is the factory/service/provider that is registered to your dependency injector that handles your authentication.
Defaults to `$authentication`.

#### setAuthClearMethod (string: method = "clearAuthKey")

This is the method in your authentication module that clears your authentication credentials. Defaults to
`clearAuthKey`.

#### setAuthGetMethod (string: method = "getAuthKey")

This is the method in your authentication module that retrieves your authentication key. If it returns a falsey
value, it assumes you're not authorised.

#### setCookieName (string: name = "__loginState")

If you try and visit a state that requires authentication and you don't have it, this is where that state information is
stored so that you are automatically redirected here after login.  This save both the state name and any parameters in
the URL.

# Saving State

By default, when you visit a private state without authentication, this will be saved to a cookie so that you can be
returned here when you log in.  If you want to turn off this behaviour (either for one state or all of them), simply
add `saveState: false` in your state's `data` element (see logout example above).  If you want to turn it off for every
state, put it at the root.

# Logging Out

The `$login` object has a `logout` method.  It accepts one parameter, which is the `redirectState`.  This can be one of
three things:

1. `true` - this will send you through to the 'fallback state'
2. A string - this will send you through to that specific state
3. Anything else - this will reload the current state and let the `run` config handle any redirect.

# Authentication Module

This is a module that you define to handle your authentication.  We need access to two module, the "clear" method and
the "get" method.  There will also likely be other methods on that class (such as a "set" method), but this project
isn't interested in those.

## Clear Method

This accepts no parameters and expects nothing back.  So long as the authentication is cleared underneath, then the
module is happy

## Get Method

This accepts no parameters.  If you are authorised, it expects to receive back `true`. Any other value received will
be treated as not logged in.

## Why isn't the authentication module part of this project?

Simple really - there are as many flavours of authentication as there are projects. Whilst I have a preferred method of
authentication (for the record, token based and then sending it over the `authorization` header prefixed with
"Bearer: "), it wouldn't be right or useful to enforce that on anyone else.

# License

MIT License

[npm-image]: https://img.shields.io/npm/v/ui-router.login.svg?style=flat
[bower-image]: https://img.shields.io/bower/v/ui-router.login.svg?style=flat
[travis-image]: https://img.shields.io/travis/riggerthegeek/ui-router.login.svg?style=flat
[dependencies-image]: https://img.shields.io/david/riggerthegeek/ui-router.login.svg?style=flat
[dev-dependencies-image]: https://img.shields.io/david/dev/riggerthegeek/ui-router.login.svg?style=flat

[npm-url]: https://npmjs.org/package/ui-router.login
[bower-url]: http://bower.io/search/?q=ui-router.login
[travis-url]: https://travis-ci.org/riggerthegeek/ui-router.login
[dependencies-url]: https://david-dm.org/riggerthegeek/ui-router.login
[dev-dependencies-url]: https://david-dm.org/riggerthegeek/ui-router.login#info=devDependencies&view=table
