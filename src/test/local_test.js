"use strict";

import sinon from "sinon";
import { waterfall } from "../js/utils";

import Local from "../js/local";

var article = {
  id: "id1",
  title: "fake1",
  url: "http://fake1",
  archived: false,
  unread: false
};

describe("Local", function() {
  var sandbox, local;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    local = new Local();
  });

  afterEach(function() {
    sandbox.restore();
    return local.drop();
  });

  describe("#createArticle", function() {
    it("should save the article", function() {
      return waterfall([
        local.createArticle.bind(local),
        local.getArticle.bind(local)
      ], article).should.become(article);
    });

    it("should return created article", function() {
      return local.createArticle(article).should.become(article);
    });
  });

  describe("#getArticle", function() {
    beforeEach(function() {
      return local.createArticle(article);
    });

    it("should retrieve an article", function() {
      return local.getArticle({id: article.id}).should.become(article);
    });

    it("should return undefined when article is not found", function() {
      return local.getArticle({id: "invalid"}).should.become(undefined);
    });
  });

  describe("#updateArticle", function() {
    beforeEach(function() {
      return local.createArticle(article);
    });

    it("should return updated article", function() {
      var updated = Object.assign({}, article, {title: "fake1mod"});
      return local.updateArticle(updated)
                  .should.eventually.have.property("title").eql("fake1mod");
    });

    it("should save updated article", function() {
      var updated = Object.assign({}, article, {title: "fake1mod"});
      var promise = waterfall([
        local.updateArticle.bind(local),
        local.getArticle.bind(local)
      ], updated);
      return promise.should.eventually.have.property("title").eql(updated.title);
    });
  });

  describe("#deleteArticle", function() {
    it("should delete an article", function() {
      return waterfall([
        local.createArticle.bind(local),
        local.deleteArticle.bind(local),
        local.getArticle.bind(local)
      ], article).should.become(undefined);
    });
  });

  describe("#listArticles", function() {
    var otherArticleBase = {
      id: "id2",
      title: "fake2",
      url: "http://fake2"
    };
    beforeEach(function() {
      return local.createArticle(article);
    });

    it("should list articles", function() {
      return local.listArticles({}).should.become([article]);
    });

    it("should select archived articles", function() {
      var otherArticle = Object.assign(otherArticleBase, {archived: true});
      return Promise.all([
        local.createArticle(otherArticle),
        local.listArticles({archived: true})
      ]).then(res => res[1]).should.become([otherArticle]);
    });

    it("should select unread articles", function() {
      var otherArticle = Object.assign(otherArticleBase, {unread: true});
      return Promise.all([
        local.createArticle(otherArticle),
        local.listArticles({unread: true})
      ]).then(res => res[1]).should.become([otherArticle]);
    });

    it("should select unread archived articles", function() {
      var otherArticle = Object.assign(otherArticleBase, {archived: true, unread: true});
      return Promise.all([
        local.createArticle(otherArticle),
        local.listArticles({archived: true, unread: true})
      ]).then(res => res[1]).should.become([otherArticle]);
    });
  });
});
