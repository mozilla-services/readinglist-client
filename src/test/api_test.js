"use strict";

import { expect } from "chai";
import { respondWith } from "./utils";
import sinon from "sinon";

import API from "../js/api";
import { AUTH_TOKEN_KEYNAME, authInterceptor } from "../js/api";
import { returns } from "./utils";
import Batch from "../js/batch";

describe("API", function() {
  var sandbox, fakeWindow, server, api, baseUrl = "http://fake.server:8000/v0";

  var sampleValidToken = "1231231231231231231231231231231231231231231231231231231231abcdef";

  var sampleArticleData = {
    url: "http://fake",
    title: "Fake",
    added_by: "Fake",
  };

  var fakeAuthError = {
    errno: 104,
    message: "Please authenticate yourself to use this endpoint.",
    code: 401,
    error: "Unauthorized"
  };

  beforeEach(function() {
    sandbox = sinon.sandbox.create({useFakeServer: true});
    server = sandbox.server;
    fakeWindow = {};
    // Configures the fake server to immediately respond with the next queued
    // response.
    server.autoRespond = true;
    api = new API(baseUrl, {window: fakeWindow});
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("authInterceptor", function() {
    // Inspired by rest basic auth interceptor tests
    // https://github.com/cujojs/rest/blob/master/test/interceptor/basicAuth-test.js
    it("should add the Authorization header", function(done) {
      var client = authInterceptor(function(request) {
        return {request: request};
      }, {authTokenGetter: returns(sampleValidToken)});
      return client({}).then(function(response) {
        expect(response.request.headers.Authorization).eql(`Bearer ${sampleValidToken}`);
        done();
      }).catch(done);
    });

    it("should not add Authorization if no token available", function(done) {
      var client = authInterceptor(function(request) {
        return {request: request};
      }, {authTokenGetter: returns(null)});
      return client({}).then(function(response) {
        expect(response.request.headers.Authorization).to.be.a("undefined");
        done();
      }).catch(done);
    });
  });

  describe("#hello()", function() {
    var serverRespond;

    beforeEach(function() {
      serverRespond = respondWith.bind(null, server, "GET /hello");
    });

    it("should fulfill request", function() {
      serverRespond({body: {hello: "readinglist"}});

      return api.hello().should.be.fulfilled;
    });

    it("should retrieve JSON information", function() {
      serverRespond({body: {hello: "readinglist"}});

      return api.hello().should.become({hello: "readinglist"});
    });
  });

  describe("#signIntoFxA()", function() {
    it("should redirect to the FxA auth endpoint", function() {
      fakeWindow.location = {
        protocol: "http",
        hostname: "test.invalid",
        port:     "1234",
        pathname: "/fake-path",
      };

      api.signinToFxA();

      expect(fakeWindow.location).eql("http://fake.server:8000/v0/fxa-oauth/login?redirect=http%2F%2Ftest.invalid%3A1234%2Ffake-path%23auth%3A#");
    });
  });

  describe("#checkAuth()", function() {
    beforeEach(function() {
      sandbox.stub(api, "setAuthToken");
    });

    it("should set any existing token from session storage", function() {
      fakeWindow.sessionStorage = {
        getItem: returns(sampleValidToken)
      };

      api.checkAuth();

      sinon.assert.calledOnce(api.setAuthToken);
      sinon.assert.calledWithExactly(api.setAuthToken, sampleValidToken);
    });

    it("should set auth token from current URL hash", function() {
      fakeWindow.sessionStorage = {
        getItem: returns(undefined)
      };
      fakeWindow.location = {
        get hash() {
          return `#auth:${sampleValidToken}`;
        },
        set hash(v) {}
      };

      api.checkAuth();

      sinon.assert.calledOnce(api.setAuthToken);
      sinon.assert.calledWithExactly(api.setAuthToken, sampleValidToken);
    });
  });

  describe("#setAuthToken()", function() {
    it("should persist auth token in session storage if valid", function() {
      fakeWindow.sessionStorage = {
        setItem: sandbox.spy()
      };

      api.setAuthToken(sampleValidToken);

      sinon.assert.calledOnce(fakeWindow.sessionStorage.setItem);
      sinon.assert.calledWithExactly(fakeWindow.sessionStorage.setItem,
        AUTH_TOKEN_KEYNAME, sampleValidToken);
    });

    it("should remove auth token from session storage if null", function() {
      fakeWindow.sessionStorage = {
        removeItem: sandbox.spy()
      };

      api.setAuthToken(null);

      sinon.assert.calledOnce(fakeWindow.sessionStorage.removeItem);
      sinon.assert.calledWithExactly(fakeWindow.sessionStorage.removeItem,
        AUTH_TOKEN_KEYNAME);
    });

    it("should return the auth token", function() {
      fakeWindow.sessionStorage = {
        setItem: sandbox.spy()
      };

      expect(api.setAuthToken(sampleValidToken)).eql(sampleValidToken);
    });
  });

  describe("#createArticle()", function() {
    var serverRespond;
    var articleData = sampleArticleData;

    beforeEach(function() {
      serverRespond = respondWith.bind(null, server, "POST /articles");
    });

    it("should reject request when unauthenticated", function() {
      serverRespond({status: 401, body: fakeAuthError});

      return api.createArticle(articleData).should.be.rejectedWith(fakeAuthError.message);
    });

    it("should create an article", function() {
      serverRespond({body: {id: 42}});

      return api.createArticle(articleData).should.become({id: 42});
    });
  });

  describe("#listArticles()", function() {
    var serverRespond;
    var articles = [sampleArticleData];

    beforeEach(function() {
      serverRespond = respondWith.bind(null, server, "GET /articles");
    });

    it("should reject request when unauthenticated", function() {
      serverRespond({status: 401, body: fakeAuthError});

      return api.listArticles({}).should.be.rejectedWith(fakeAuthError.message);
    });

    it("should retrieve articles list", function() {
      serverRespond({body: {items: articles}});

      return api.listArticles({}).should.become(articles);
    });

    it("should clear any previously stored Next-Page header value", function() {
      api._nextPageUrl = "http://invalid.next/";

      api.listArticles();

      expect(api.hasNext()).eql(false);
    });

    it("should intercept and store new Next-Page header value", function(done) {
      serverRespond({
        headers: {"Next-Page": "http://invalid.next/"},
        body:    {items: articles}
      });

      api.listArticles().then(function() {
        expect(api._nextPageUrl).eql("http://invalid.next/");
        done();
      }).catch(done);
    });

    it("should store the total nb of records out of the Total-Records header",
      function(done) {
        serverRespond({body: [], headers: {"Total-Records": "12"}});

        api.listArticles().then(function() {
          expect(api.totalRecords).eq(12);
          done();
        }).catch(done);
      });

    it("should apply passed filters", function(done) {
      api.client = sandbox.stub().returns(Promise.resolve({entity: {items: []}}));

      api.listArticles({unread: false, status: "1"}).then(function() {
        sinon.assert.calledOnce(api.client);
        sinon.assert.calledWithMatch(api.client, {params: {unread: false, status: "1"}});
        done();
      }).catch(done);
    });
  });

  describe("#hasNext()", function() {
    it("should check if next page is known", function() {
      api._nextPageUrl = "http://invalid.next/";

      expect(api.hasNext()).eql(true);
    });

    it("should check if next page is unknown", function() {
      api._nextPageUrl = null;

      expect(api.hasNext()).eql(false);
    });
  });

  describe("#listNext()", function() {
    var serverRespond;
    var articles = [sampleArticleData];

    beforeEach(function() {
      serverRespond = respondWith.bind(null, server, "GET /articles");
    });

    it("should raise an error if no next page is known", function() {
      return api.listNext().should.be.rejectedWith(Error, /No next articles page/);
    });

    it("should fetch the next page url", function(done) {
      api._nextPageUrl = "http://invalid.next/";

      serverRespond({body: {items: articles}});

      api.listNext().then(function() {
        expect(sandbox.server.requests[0].url).eql("http://invalid.next/");
        done();
      });
    });

    it("should return articles", function() {
      api._nextPageUrl = "http://invalid.next/";

      serverRespond({body: {items: articles}});

      return api.listNext().should.become(articles);
    });
  });

  describe("#getArticle()", function() {
    var serverRespond;

    beforeEach(function() {
      serverRespond = respondWith.bind(null, server, "GET /articles/42");
    });

    it("should reject request when unauthenticated", function() {
      serverRespond({status: 401, body: fakeAuthError});

      return api.getArticle({id: 42}).should.be.rejectedWith(fakeAuthError.message);
    });

    it("should retrieve an article", function() {
      serverRespond({body: sampleArticleData});

      return api.getArticle({id: 42}).should.become(sampleArticleData);
    });
  });

  describe("#deleteArticle()", function() {
    var serverRespond;

    beforeEach(function() {
      serverRespond = respondWith.bind(null, server, "DELETE /articles/42");
    });

    it("should reject request when unauthenticated", function() {
      serverRespond({status: 401, body: fakeAuthError});

      return api.deleteArticle({id: 42}).should.be.rejectedWith(fakeAuthError.message);
    });

    it("should retrieve an article", function() {
      serverRespond({body: ""}); // response has an empty body

      return api.deleteArticle({id: 42}).should.become("");
    });
  });

  describe("#updateArticle()", function() {
    var serverRespond;

    beforeEach(function() {
      serverRespond = respondWith.bind(null, server, "PATCH /articles/42");
    });

    it("should reject request when unauthenticated", function() {
      serverRespond({status: 401, body: fakeAuthError});

      return api.updateArticle({title: "bar"}).should.be.rejectedWith(fakeAuthError.message);
    });

    it("should update an article", function() {
      serverRespond({body: {title: "bar"}});

      return api.updateArticle({id: 42}).should.become({title: "bar"});
    });

    it("should update an article individual field", function() {
      serverRespond({body: {unread: false}});

      return api.updateArticle({id: 42, unread: false}).should.become({unread: false});
    });
  });

  describe("#createBatch()", function() {
    it("should return a new Batch instance", function() {
      expect(api.createBatch()).to.be.an.instanceOf(Batch);
    });
  });

  describe("#batch()", function() {
    var serverRespond;

    beforeEach(function() {
      serverRespond = respondWith.bind(null, server, "POST /batch");
    });

    it("should reject request when unauthenticated", function() {
      serverRespond({status: 401, body: fakeAuthError});

      return api.batch({}).should.be.rejectedWith(fakeAuthError.message);
    });

    it("should return the list of batch operations", function() {
      serverRespond({body: {sample: true}});

      return api.batch({}).should.become({sample: true});
    });
  });
});
