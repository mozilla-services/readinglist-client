"use strict";

import { expect } from "chai";
import sinon from "sinon";

import { returns } from "../utils";
import { Dispatcher, AuthStore } from "../../js/flux";

describe("ArticleStore", function() {
  var sandbox;

  function createStore(api) {
    return new AuthStore(api);
  }

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    Dispatcher.clear();
    sandbox.restore();
  });

  describe("#constructor()", function() {
    it("should set initial state by default", function() {
      var store = createStore({});

      expect(store.state.authToken).eql(null);
    });
  });

  describe("#signin()", function() {
    it("should sign the user to FxA in using the API", function() {
      var spy = sandbox.spy();
      var store = createStore({signinToFxA: spy});

      store.signin();

      sinon.assert.calledOnce(spy);
    });
  });

  describe("#checkAuth()", function() {
    it("should update state with auth token if retrieved", function() {
      var store = createStore({checkAuth: returns("fakeToken")});

      store.checkAuth();

      expect(store.state.authToken).eql("fakeToken");
    });

    it("should update state with null auth token if missing", function() {
      var store = createStore({checkAuth: returns(null)});

      store.checkAuth();

      expect(store.state.authToken).eql(null);
    });
  });

  describe("#signout()", function() {
    it("should sign the user out from FxA using the API", function() {
      var spy = sandbox.spy();
      var store = createStore({signout: spy});

      store.signout();

      sinon.assert.calledOnce(spy);
    });

    it("should reset auth token state", function() {
      var store = createStore({signout: function(){}});
      store.setState({authToken: "fakeToken"});

      store.signout();

      expect(store.state.authToken).eql(null);
    });
  });
});
