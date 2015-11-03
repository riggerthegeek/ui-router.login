/**
 * loginProvider
 */

"use strict";


/* Node modules */


/* Third-party modules */
import "angular-ui-router";
import {_} from "lodash";


/* Files */


describe("provider: $loginProvider", function () {

    let $login,
        $loginProvider,
        authFactory,
        ipCookie,
        stateFactory;

    let init = (fn) => {

        if (_.isFunction(fn)) {
            angular.mock.module(fn);
        }

        angular.mock.inject((_$login_) => {
            $login = _$login_;
        });

    };

    beforeEach(angular.mock.module("ui.router.login"));

    beforeEach(() => {

        angular.mock.module((_$loginProvider_) => {
            $loginProvider = _$loginProvider_;
        });

    });

    describe("methods", () => {

        beforeEach(() => {

            authFactory = {
                clearAuthKey: sinon.stub(),
                getAuthKey: sinon.stub()
            };
            ipCookie = sinon.stub();
            stateFactory = {
                go: sinon.stub(),
                reload: sinon.stub()
            };

            angular.mock.module(($provide) => {

                $provide.factory("$authentication", () => {
                    return authFactory;
                });

                $provide.factory("ipCookie", () => {
                    return ipCookie;
                });

                $provide.factory("$state", () => {
                    return stateFactory;
                });

                expect($loginProvider.setDefaultLoggedInState("app.loggedin")).to.be.equal($loginProvider);
                expect($loginProvider.setFallbackState("app.fallback")).to.be.equal($loginProvider);

            });

        });

        describe("#checkLoggedIn", () => {

            it("should do nothing if logged in", () => {

                init();

                authFactory.getAuthKey.returns(true);

                expect($login.checkLoggedIn()).to.be.undefined;

                expect(stateFactory.go).to.not.be.called;

            });

            it("should redirect if not logged in", () => {

                init();

                authFactory.getAuthKey.returns(false);

                stateFactory.go.returns("promise");

                expect($login.checkLoggedIn("currentState", {
                    current: "params"
                })).to.be.equal("promise");

                expect(stateFactory.go).to.be.calledOnce
                    .calledWithExactly("app.fallback");

                expect(ipCookie).to.be.calledOnce
                    .calledWithExactly("__loginData", {
                        state: "currentState",
                        params: { current: "params" }
                    }, {
                        path: "/"
                    });

            });

            it("should redirect if not logged in and not save the state", () => {

                init();

                authFactory.getAuthKey.returns(false);

                stateFactory.go.returns("promise");

                expect($login.checkLoggedIn("currentState", {
                    current: "params"
                }, false)).to.be.equal("promise");

                expect(stateFactory.go).to.be.calledOnce
                    .calledWithExactly("app.fallback");

                expect(ipCookie).to.not.be.called;

            });

        });

        describe("#getLoginRedirect", () => {

            it("should call a specified cookie", () => {

                init(() => {

                    expect($loginProvider.setCookieName("mycookie")).to.be.equal($loginProvider);

                });

                stateFactory.go.returns("promise");
                ipCookie.returns(undefined);

                expect($login.getLoginRedirect()).to.be.equal("promise");

                expect(ipCookie).to.be.calledOnce
                    .calledWithExactly("mycookie");

                expect(stateFactory.go).to.be.calledOnce
                    .calledWithExactly("app.loggedin", {});

            });

            it("should redirect to the default state when nothing in the cookie", () => {

                init();

                stateFactory.go.returns("promise");
                ipCookie.returns(undefined);

                expect($login.getLoginRedirect()).to.be.equal("promise");

                expect(ipCookie).to.be.calledOnce
                    .calledWithExactly("__loginData");

                expect(stateFactory.go).to.be.calledOnce
                    .calledWithExactly("app.loggedin", {});

            });

            it("should redirect to the state set in the cookie with no params", () => {

                init();

                stateFactory.go.returns("promise");
                ipCookie.returns({
                    state: "app.state"
                });

                expect($login.getLoginRedirect()).to.be.equal("promise");

                expect(ipCookie).to.be.calledOnce
                    .calledWithExactly("__loginData");

                expect(stateFactory.go).to.be.calledOnce
                    .calledWithExactly("app.state", {});

            });

            it("should redirect to the state set in the cookie with some params", () => {

                init();

                stateFactory.go.returns("promise");
                ipCookie.returns({
                    state: "app.state",
                    params: {
                        hello: "world"
                    }
                });

                expect($login.getLoginRedirect()).to.be.equal("promise");

                expect(ipCookie).to.be.calledOnce
                    .calledWithExactly("__loginData");

                expect(stateFactory.go).to.be.calledOnce
                    .calledWithExactly("app.state", {
                        hello: "world"
                    });

            });

        });

        describe("#isLoggedIn", () => {

            it("should return as logged in", () => {

                init();

                authFactory.getAuthKey.returns(true);

                expect($login.isLoggedIn()).to.be.true;

            });

            it("should return as not logged in", () => {

                init();

                authFactory.getAuthKey.returns(false);

                expect($login.isLoggedIn()).to.be.false;

            });

            it("should return truthy and be logged in", () => {

                init();

                authFactory.getAuthKey.returns(47);

                expect($login.isLoggedIn()).to.be.true;

            });

            it("should return null and be logged out", () => {

                init();

                authFactory.getAuthKey.returns(null);

                expect($login.isLoggedIn()).to.be.false;

            });

            it("should return 0 and be logged out", () => {

                init();

                authFactory.getAuthKey.returns(0);

                expect($login.isLoggedIn()).to.be.false;

            });

            it("should return undefined and be logged out", () => {

                init();

                authFactory.getAuthKey.returns(void 0);

                expect($login.isLoggedIn()).to.be.false;

            });

            it("should throw an error if the authentication method doesn't exist", () => {

                authFactory = {
                };

                init();

                let fail = false;

                try {
                    $login.isLoggedIn();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("$authentication.getAuthKey() is not a function");

                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

        describe("#logout", () => {

            it("it should logout and go to the fallback state", () => {

                init();

                stateFactory.go.returns("promise");

                expect($login.logout(true)).to.be.equal("promise");

                expect(stateFactory.go).to.be.calledOnce
                    .calledWithExactly("app.fallback");

                expect(stateFactory.reload).to.not.be.called;

            });

            it("it should logout and go to a specific state", () => {

                init();

                stateFactory.go.returns("promise");

                expect($login.logout("app.newstate")).to.be.equal("promise");

                expect(stateFactory.go).to.be.calledOnce
                    .calledWithExactly("app.newstate");

                expect(stateFactory.reload).to.not.be.called;

            });

            it("it should logout and reload the current state", () => {

                init();

                stateFactory.reload.returns("promise");

                expect($login.logout()).to.be.equal("promise");

                expect(stateFactory.reload).to.be.calledOnce
                    .calledWithExactly();

                expect(stateFactory.go).to.not.be.called;

            });

            it("should throw an error if clear method doesn't exist", () => {

                authFactory = {};

                init();

                let fail = false;

                try {
                    $login.logout();
                } catch (err) {

                    fail = true;

                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal("$authentication.clearAuthKey() is not a function");

                } finally {
                    expect(fail).to.be.true;
                }

            });

        });

    });

});
