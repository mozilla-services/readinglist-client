"use strict";

import { expect } from "chai";
import sinon from "sinon";
import localforage from "localforage";

import { returns } from "./utils";

import Local from "../js/local";

var article = {id: "id1", title: "fake1", url: "http://fake1"};

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
    it("should create an article", function() {
      return local.createArticle(article).should.become(article);
    });
  });

  describe("#listArticles", function() {
    beforeEach(function() {
      return local.createArticle(article);
    });

    it("should list articles", function() {
      return local.listArticles({}).should.become([article]);
    });
  });
});
