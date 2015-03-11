"use strict";

//import { expect } from "chai";
import sinon from "sinon";
import { returns } from "./testutils";

import API from "../js/api";
import Local from "../js/local";

import Provider from "../js/provider";

var article = {
  id: "id1",
  title: "fake1",
  url: "http://fake1",
  archived: false,
  unread: false
};

describe("Local", function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("#createArticle()", function() {
    var api, local, provider;

    beforeEach(function() {
      api = new API("http://test.invalid/");
      local = new Local();
      provider = new Provider(local, api, {navigator: {onLine: true}});
    });

    it("should proceed saving the article directly when online", function() {
      sandbox.stub(api, "createArticle", returns(Promise.resolve(article)));
      sandbox.stub(local, "createArticle", returns(Promise.resolve(article)));

      return provider.createArticle(article).should.become(article);
    });

    it("should handle api error", function() {
      var err = new Error("api error");
      sandbox.stub(api, "createArticle", returns(Promise.reject(err)));
      sandbox.stub(local, "createArticle", returns(Promise.resolve(article)));

      return provider.createArticle(article).should.be.rejectedWith(err);
    });

    it("should handle local db error", function() {
      var err = new Error("db error");
      sandbox.stub(api, "createArticle", returns(Promise.resolve(article)));
      sandbox.stub(local, "createArticle", returns(Promise.reject(err)));

      return provider.createArticle(article).should.be.rejectedWith(err);
    });

    it("should proceed batching article creation when offline", function() {
      sandbox.stub(api, "createArticle", returns(Promise.resolve(article)));
      sandbox.stub(local, "createArticle", returns(Promise.resolve(article)));
      sandbox.stub(provider.batch, "createArticle", returns(Promise.resolve(article)));

      return provider.createArticle(article).should.become(article);
    });
  });
});
