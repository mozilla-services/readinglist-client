"use strict";

import { expect } from "chai";
import sinon from "sinon";

import { returns } from "./utils";

import ContentManager from "../js/content";

var article = {id: "id1", url: "http://fake1"};

describe("ContentManager", function() {
  var sandbox, fakeClient, fakeLocalStorage, manager;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    fakeLocalStorage = {
      getItem(key) { return this[key] || null; },
      setItem(key, val) { this[key] = val; },
      removeItem(key) { delete this[key]; }
    };

    fakeClient = {};

    manager = new ContentManager("http://invalid.test/", {
      client: fakeClient,
      storage: fakeLocalStorage,
      keyPrefix: "prefix_"
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("#fetch()", function() {
    it("should fetch article contents from its URL", function() {
      manager.client = sinon.stub().returns(new Promise(function(f) {f();}));

      manager.fetch(article);

      sinon.assert.calledWithMatch(manager.client, {params: {url: article.url}});
    });

    it("should fetch an article contents", function() {
      manager.client = returns(Promise.resolve({entity: {content: "bar"}}));

      return manager.fetch(article).should.become("bar");
    });

    it("should save fetched contents in local storage", function(done) {
      sandbox.stub(manager, "save");

      manager.client = returns(Promise.resolve({entity: {content: "bar"}}));

      manager.fetch(article).then(() => {
        sinon.assert.calledOnce(manager.save);
        sinon.assert.calledWithExactly(manager.save, article, "bar");
        done();
      });
    });

    it("should reject on fetch failure", function() {
      manager.client = returns(Promise.reject("boo"));

      return manager.fetch(article).should.be.rejectedWith(/Unable to fetch contents/);
    });
  });

  describe("#load()", function() {
    it("should load an article from local storage when available", function() {
      manager.save(article, "bar");

      return manager.load(article).should.become("bar");
    });

    it("should fetch article contents if not available locally", function() {
      manager.client = returns(Promise.resolve({entity: {content: "bar"}}));

      return manager.load(article).should.become("bar");
    });

    it("should reject when contents are unavailable", function() {
      manager.client = returns(Promise.reject("boo"));

      return manager.load(article).should.be.rejectedWith(/Unable to fetch contents/);
    });
  });

  describe("#save()", function() {
    it("should save contents in local storage", function() {
      manager.save(article, "foo");

      expect(fakeLocalStorage.getItem("prefix_id1")).eql("foo");
    });

    it("should only save string values", function() {
      sandbox.stub(fakeLocalStorage, "setItem");

      manager.save(article, null);

      sinon.assert.notCalled(fakeLocalStorage.setItem);
    });
  });

  describe("#drop()", function() {
    it("should remove saved article contents from local storage", function() {
      manager.save(article, "foo");

      manager.drop(article);

      expect(fakeLocalStorage.getItem("prefix_id1")).to.be.a("null");
    });
  });

  describe("#has()", function() {
    it("should check if local storage has article contents saved", function() {
      manager.save(article, "foo");

      expect(manager.has(article)).eql(true);
    });

    it("should check if local storage misses article contents", function() {
      expect(manager.has(article)).eql(false);
    });
  });
});
