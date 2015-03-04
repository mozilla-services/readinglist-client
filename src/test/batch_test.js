"use strict";

import { expect } from "chai";
import sinon from "sinon";

import API from "../js/api";
import Batch from "../js/batch";

var art1 = {id: 1, url: "http://fake1", title: "Fake1", added_by: "User1"};
var art2 = {id: 2, url: "http://fake2", title: "Fake2", added_by: "User2"};

describe("Batch", function() {
  var sandbox, api;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    api = new API("http://invalid.test");
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("#constructor()", function() {
    it("should require an API instance", function() {
      /*eslint new-cap:0*/
      expect(function() {
        new Batch();
      }).to.Throw(/Invalid API instance/);
    });
  });

  describe("#createArticle()", function() {
    it("should enqueue creation of provided article", function() {
      var batch = new Batch(api);

      batch.createArticle(art1);

      expect(batch.toQuery().requests).to.have.length.of(1);
      expect(batch.toQuery().requests[0].body).eql(art1);
    });

    it("should enqueue creation of several articles", function() {
      var batch = new Batch(api);

      batch.createArticle(art1, art2);

      expect(batch.toQuery().requests).to.have.length.of(2);
      expect(batch.toQuery().requests[0].body).eql(art1);
      expect(batch.toQuery().requests[1].body).eql(art2);
    });
  });

  describe("#toQuery()", function() {
    it("should return a batch query", function() {
      var batch = new Batch(api, {foo: "bar"});

      batch.createArticle(art1, art2);

      var query = batch.toQuery();
      expect(query.defaults).eql({foo: "bar"});
      expect(JSON.stringify(query.requests)).eql(JSON.stringify([{
        method: "POST",
        path: "/articles",
        body: art1
      }, {
        method: "POST",
        path: "/articles",
        body: art2
      }]));
    });
  });

  describe("#process()", function() {
    it("should run the query against the api client", function() {
      var client = sandbox.stub(api, "batch");
      var batch = new Batch(api);

      batch.createArticle(art1).process();

      sinon.assert.calledOnce(client);
      sinon.assert.calledWithExactly(client, batch.toQuery());
    });
  });
});
