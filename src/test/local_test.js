"use strict";

import { expect } from "chai";
import sinon from "sinon";
import localforage from "localforage";

import { returns } from "./utils";

import Local from "../js/local";

var article = {id: "id1", url: "http://fake1"};

describe("Local", function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("#constructor()", function() {
    it("should expose a storage object", function() {
      var local = new Local();

      expect(local.storage).to.be.an("object");
    });

    it("should configure the storage object", function() {
      sandbox.stub(localforage, "config");

      new Local({storageConfig: {version: 42.0}});

      sinon.assert.calledOnce(localforage.config);
      sinon.assert.calledWithMatch(localforage.config, {version: 42.0});
    });

    it("should merge custom storage options with defaults", function() {
      sandbox.stub(localforage, "config");

      new Local({storageConfig: {version: 42.0}});

      sinon.assert.calledWithExactly(localforage.config, {
        name: "readinglist-client",
        storeName: "articles",
        version: 42.0
      });
    });

    it("should implement the EventEmitter API", function() {
      var local = new Local();

      expect(local.on).to.be.a("function");
      expect(local.emit).to.be.a("function");
    });
  });

  describe("constructed", function() {
    var local;

    beforeEach(function() {
      local = new Local();
    });

    afterEach(function() {
      local.storage.clear();
    });

    describe("#initDB", function() {
      it("description", function() {
        // body...
      });
    });

    describe("#createArticle", function() {
      it("should create an article", function() {
        return local.createArticle(article).should.become(article);
      });

      it("should emit a 'created' event", function(done) {
        local.once("created", function(art) {
          expect(art).eql(article);
          done();
        }).createArticle(article);
      });
    });
  });
});
