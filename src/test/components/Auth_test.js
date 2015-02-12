"use strict";

import React from "react/addons";
import sinon from "sinon";
import { expect } from "chai";
import { AuthActions, AuthStore, stores} from "../../js/flux";
import { $ } from "../utils";

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
    var signinButton;

    beforeEach(function() {
      signinButton = $(view, "button");
    });

    it("should render a signin button", function() {
      expect(signinButton).not.eql(null);
      expect(signinButton.textContent).eql("Sign in");
    });

    it("should trigger the signin AuthAction", function() {
      TestUtils.Simulate.click(signinButton);

      sinon.assert.calledOnce(AuthActions.signin);
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


