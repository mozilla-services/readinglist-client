"use strict";

import { expect } from "chai";
import { respondWith } from "./utils";
import sinon from "sinon";

import API from "../js/api";

describe("API", function() {
  var sandbox, server, api, baseUrl = "http://localhost:8000/v0";

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
    // Configures the fake server to immediately respond with the next queued
    // response.
    server.autoRespond = true;
    api = new API(baseUrl);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("hello", function() {
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

  describe("createArticle", function() {
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

  describe("listArticles", function() {
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
  });

  describe("getArticle", function() {
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

  describe("deleteArticle", function() {
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

  describe("updateArticle", function() {
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
      return api.updateArticle({id: 42}).should.become({
        title: "bar"
      });
    });
  });
});
