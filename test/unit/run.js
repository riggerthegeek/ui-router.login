/**
 * run
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


describe("run", function () {

    let $rootScope,
        $login;

    beforeEach(angular.mock.module("ui.router.login"));

    beforeEach(() => {

        angular.mock.module(($provide) => {

            $provide.factory("$login", () => {

                return {
                    checkLoggedIn: sinon.spy(),
                    isLoggedIn: sinon.stub()
                };

            });

        });

        angular.mock.inject((_$login_, _$rootScope_) => {
            $login = _$login_;
            $rootScope = _$rootScope_;
        });

    });

    it("should mock a state that doesn't have a data object", () => {

        let event = $rootScope.$emit("$stateChangeStart");

        expect(event.defaultPrevented).to.be.false;

    });

    it("should mock a state that doesn't have a requireLogin element", () => {

        let toState = {
            data: {}
        };

        let event = $rootScope.$emit("$stateChangeStart", toState);

        expect(event.defaultPrevented).to.be.false;

    });

    it("should mock a state has requireLogin === false", () => {

        let toState = {
            data: {
                requireLogin: false
            }
        };

        let event = $rootScope.$emit("$stateChangeStart", toState);

        expect(event.defaultPrevented).to.be.false;

    });

    it("should mock a state has requireLogin === true but is logged in", () => {

        let toState = {
            data: {
                requireLogin: true
            }
        };

        $login.isLoggedIn.returns(true);

        let event = $rootScope.$emit("$stateChangeStart", toState);

        expect(event.defaultPrevented).to.be.false;

        expect($login.isLoggedIn).to.be.calledOnce;

    });

    it("should mock a state has requireLogin === true but is not logged in", () => {

        let toState = {
            name: "myname",
            data: {
                requireLogin: true,
                saveState: true
            }
        };

        $login.isLoggedIn.returns(false);

        let event = $rootScope.$emit("$stateChangeStart", toState, "toParams");

        expect(event.defaultPrevented).to.be.true;

        expect($login.isLoggedIn).to.be.calledOnce;

        expect($login.checkLoggedIn).to.be.calledOnce
            .calledWithExactly("myname", "toParams", true);

    });

});
