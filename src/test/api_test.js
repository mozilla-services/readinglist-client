"use strict";

var expect = require("chai").expect;
var sinon = require("sinon");

var testUtils = require("./utils");
var API = require("../js/api");

describe("API", function() {
  var sandbox, server, api, baseUrl = "http://localhost:8000/v0";

  var sampleArticleData = {
    url: "http://fake",
    title: "Fake",
    added_by: "Fake",
  };

  /* jshint unused:false */
  /**
   * JSON dump utility function, for debugging purpose.
   */
  function jdump(o) {
    console.log(JSON.stringify(o, null, 4));
  }
  /* jshint unused:true */

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
      serverRespond = testUtils.respondWith.bind(null, server, "GET /hello");
    });

    it("should fulfill request", function() {
      serverRespond({body: {hello: "readinglist"}});
      return api.hello().should.be.fulfilled;
    });

    it("should retrieve JSON information", function(done) {
      serverRespond({body: {hello: "readinglist"}});
      return api.hello().then(function(response) {
        expect(response.entity.hello).eql("readinglist");
        done();
      });
    });
  });

  describe("createArticle", function() {
    var serverRespond;
    var articleData = sampleArticleData;

    beforeEach(function() {
      serverRespond = testUtils.respondWith.bind(null, server, "POST /articles");
    });

    it("should reject request when unauthenticated", function() {
      serverRespond({status: 401, body: {message: "Wrong."}});
      return api.createArticle(articleData).should.be.rejectedWith("Wrong.");
    });

    it("should create an article", function(done) {
      serverRespond({body: {id: 42}});
      return api.createArticle(articleData).then(function(response) {
        expect(response.entity.id).eql(42);
        done();
      });
    });
  });

  describe("listArticles", function() {
    var serverRespond;
    var articles = [sampleArticleData];

    beforeEach(function() {
      serverRespond = testUtils.respondWith.bind(null, server, "GET /articles");
    });

    it("should reject request when unauthenticated", function() {
      serverRespond({status: 401, body: {message: "Wrong."}});
      return api.listArticles({}).should.be.rejectedWith("Wrong.");
    });

    it("should retrieve articles list", function(done) {
      serverRespond({body: {items: articles}});
      return api.listArticles({}).then(function(response) {
        expect(response.entity.items).to.have.length.of(1);
        done();
      });
    });
  });

  describe("getArticle", function() {
    var serverRespond;

    beforeEach(function() {
      serverRespond = testUtils.respondWith.bind(null, server, "GET /article/42");
    });

    it("should reject request when unauthenticated", function() {
      serverRespond({status: 401, body: {message: "Wrong."}});
      return api.getArticle({id: 42}).should.be.rejectedWith("Wrong.");
    });

    it("should retrieve an article", function(done) {
      serverRespond({body: sampleArticleData});
      return api.getArticle({id: 42}).then(function(response) {
        expect(response.entity).to.eql(sampleArticleData);
        done();
      });
    });
  });

  describe("deleteArticle", function() {
    var serverRespond;

    beforeEach(function() {
      serverRespond = testUtils.respondWith.bind(null, server, "DELETE /article/42");
    });

    it("should reject request when unauthenticated", function() {
      serverRespond({status: 401, body: {message: "Wrong."}});
      return api.deleteArticle({id: 42}).should.be.rejectedWith("Wrong.");
    });

    it("should retrieve an article", function() {
      serverRespond({body: ""});
      return api.deleteArticle({id: 42}).should.be.fulfilled;
    });
  });
});
