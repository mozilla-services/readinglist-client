"use strict";

import React from "react/addons";
import sinon from "sinon";
import { expect } from "chai";
import { AuthActions, AuthStore, stores} from "../../js/flux";
import { $ } from "../testutils";

import Auth from "../../js/components/Auth";

var TestUtils = React.addons.TestUtils;

describe("Auth tests", function() {
  var sandbox, authStore, view;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    authStore = new AuthStore({});
    stores.register({authStore: authStore});
    sandbox.stub(AuthActions);
    view = TestUtils.renderIntoDocument(<Auth />);
  });

  afterEach(function() {
    stores.clear();
    sandbox.restore();
  });

  describe("Auth", function() {
    it("should check auth on initial mount", function() {
      sinon.assert.calledOnce(AuthActions.checkAuth);
    });
  });

  describe("Auth > SignIn", function() {
    var signinForm, signinButton;

    beforeEach(function() {
      signinForm = $(view, "form");
      signinButton = $(view, "button");
    });

    it("should render a signin button", function() {
      expect(signinButton).not.eql(null);
      expect(signinButton.textContent).match(/Sign in/);
    });

    it("should render a register link", function() {
      var registerLink = $(view, "a");
      expect(registerLink).not.eql(null);
      expect(registerLink.textContent).match(/Sign up/);
    });

    it("should trigger the signin AuthAction", function() {
      TestUtils.Simulate.submit(signinForm);

      sinon.assert.calledOnce(AuthActions.signin);
      sinon.assert.calledWithExactly(AuthActions.signin, {persistent: false});
    });

    it("should trigger the signin AuthAction with persistent parameter",
      function() {
        var rememberMe = $(view, "input[type=checkbox]");
        rememberMe.checked = true;
        TestUtils.Simulate.submit(signinForm);

        sinon.assert.calledOnce(AuthActions.signin);
        sinon.assert.calledWithExactly(AuthActions.signin, {persistent: true});
      });
  });

  describe("Auth > UserInfo", function() {
    var signoutButton;

    beforeEach(function() {
      authStore.setState({authToken: "fake"});
      signoutButton = $(view, "button");
    });

    it("should render a signin button", function() {
      expect(signoutButton).not.eql(null);
      expect(signoutButton.textContent).eql("Sign out");
    });

    it("should trigger the signin AuthAction", function() {
      TestUtils.Simulate.click(signoutButton);

      sinon.assert.calledOnce(AuthActions.signout);
    });
  });
});


