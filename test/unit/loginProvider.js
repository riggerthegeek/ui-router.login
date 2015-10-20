/**
 * loginProvider
 */

"use strict";


/* Node modules */


/* Third-party modules */
import "angular-ui-router";


/* Files */


describe("provider: $loginProvider", function () {

    let $login;

    let init = () => {

        angular.mock.inject((_$login_) => {
            $login = _$login_;
        });

    };

    beforeEach(angular.mock.module("ui.router.login"));

    describe("default settings", () => {

        var authFactory = {
                getAuthKey: sinon.stub()
            },
            stateFactory = {
                go: sinon.stub()
            };

        beforeEach(() => {

            angular.mock.module(($provide) => {

                $provide.factory("$authentication", () => {
                    return authFactory;
                });

                $provide.factory("$state", () => {
                    return stateFactory;
                });

            });

        });

        describe("#checkLoggedIn", () => {

            beforeEach(() => {
                angular.mock.module(($loginProvider) => {

                    expect($loginProvider.setFallbackState("app.fallback")).to.be.equal($loginProvider);
                    expect($loginProvider.setDefaultLoggedInState("app.loggedin")).to.be.equal($loginProvider);

                });
            });

            it("should do nothing if logged in", () => {

                init();

                authFactory.getAuthKey.returns(true);

                expect($login.checkLoggedIn()).to.be.undefined;

                expect(stateFactory.go).to.not.be.called;

            });

        });

    });

});
