"use strict";

import { expect } from "chai";
import sinon from "sinon";

import { asyncAssert, returns, returnPromise, fulfiller, rejecter } from "../utils";

import { Dispatcher, ArticleStore, ArticleActions } from "../../js/flux";

describe("ArticleStore", function() {
  var sandbox;

  var art1 = {id: 1, url: "http://fake1", title: "Fake1", added_by: "User1"};
  var art2 = {id: 2, url: "http://fake2", title: "Fake2", added_by: "User2"};

  function createStore(api) {
    return new ArticleStore(api);
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

      expect(store.state.articles).eql([]);
      expect(store.state.current).eql(null);
      expect(store.state.error).eql(null);
      expect(store.state.errorType).eql(null);
    });
  });

  describe("#add()", function() {
    var store;

    beforeEach(function() {
      store = createStore({});
      store.add();
    });

    it("should enable edit mode", function() {
      expect(store.state.edit).eql(true);
    });

    it("should reset current article", function() {
      expect(store.state.current).eql(null);
    });
  });

  describe("#create()", function() {
    it("should reset error state", function() {
      var store = createStore({
        createArticle: returnPromise(fulfiller(art1))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.create(art1);

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      sandbox.stub(ArticleActions, "list");
      createStore({createArticle: returnPromise(fulfiller(art1))});

      ArticleActions.create(art1);

      asyncAssert(done, function() {
        sinon.assert.called(ArticleActions.list);
      });
    });

    it("should update state with an error on failure", function(done) {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({createArticle: returnPromise(rejecter("boo"))});

      ArticleActions.create(art1);

      asyncAssert(done, function() {
        expect(store.state.error).eql("boo");
      });
    });
  });

  describe("#updateArticleList()", function() {
    var store;

    beforeEach(function() {
      store = createStore({
        articles: [],
        hasNext: returns(true),
        totalRecords: 12
      });

      store.updateArticleList([art1, art2]);
    });

    it("should update article list state", function() {
      expect(store.state.articles).eql([art1, art2]);
    });

    it("should update totalRecords state", function() {
      expect(store.state.totalRecords).eql(12);
    });

    it("should update hasNext state", function() {
      expect(store.state.hasNext).eql(true);
    });
  });

  describe("#edit()", function() {
    var store;

    beforeEach(function() {
      store = createStore({});
      store.edit(art1);
    });

    it("should enable edit mode", function() {
      expect(store.state.edit).eql(true);
    });

    it("should set current article", function() {
      expect(store.state.current).eql(art1);
    });
  });

  describe("#cancelEdit()", function() {
    var store;

    beforeEach(function() {
      store = createStore({});
      store.cancelEdit();
    });

    it("should disable edit mode", function() {
      expect(store.state.edit).eql(false);
    });
  });

  describe("#update()", function() {
    it("should reset error state", function() {
      var store = createStore({
        updateArticle: returnPromise(fulfiller(art1))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.update(art1);

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      sandbox.stub(ArticleActions, "list");
      createStore({updateArticle: returnPromise(fulfiller(art1))});

      ArticleActions.update(art1);

      asyncAssert(done, function() {
        sinon.assert.called(ArticleActions.list);
      });
    });

    it("should disable edit mode on success", function(done) {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({updateArticle: returnPromise(fulfiller(art1))});
      store.setState({edit: true, current: art1});

      ArticleActions.update(art1);

      asyncAssert(done, function() {
        expect(store.state.edit).eql(false);
      });
    });

    it("should update state with an error on failure", function(done) {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({
        updateArticle: returnPromise(rejecter("boo"))
      });

      ArticleActions.update(art1);

      asyncAssert(done, function() {
        expect(store.state.error).eql("boo");
      });
    });
  });

  describe("#delete()", function() {
    it("should reset error state", function() {
      var store = createStore({
        deleteArticle: returnPromise(fulfiller(art1))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.delete(art1);

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      sandbox.stub(ArticleActions, "list");
      createStore({deleteArticle: returnPromise(fulfiller(art1))});

      ArticleActions.delete(art1);

      asyncAssert(done, function() {
        sinon.assert.called(ArticleActions.list);
      });
    });

    it("should disable edit mode on success", function(done) {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({deleteArticle: returnPromise(fulfiller(art1))});
      store.setState({edit: true, current: art1});

      ArticleActions.delete(art1);

      asyncAssert(done, function() {
        expect(store.state.edit).eql(false);
      });
    });

    it("should update state with an error on failure", function(done) {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({
        deleteArticle: returnPromise(rejecter("boo"))
      });

      ArticleActions.delete(art1);

      asyncAssert(done, function() {
        expect(store.state.error).eql("boo");
      });
    });

    it("should update state current article if just deleted", function(done) {
      var store = createStore({deleteArticle: returnPromise(fulfiller(art1))});
      store.setState({current: art1});

      ArticleActions.delete(art1);

      asyncAssert(done, function() {
        expect(store.state.current).to.be.a("null");
      });
    });
  });

  describe("#get()", function() {
    it("should reset error state", function() {
      var store = createStore({
        getArticle: returnPromise(fulfiller(art1))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.get({id: 42});

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      var store = createStore({
        getArticle: returnPromise(fulfiller(art1))
      });

      ArticleActions.get({id: 42});

      asyncAssert(done, function() {
        expect(store.state.current).eql(art1);
      });
    });

    it("should update state with an error on failure", function(done) {
      var store = createStore({
        getArticle: returnPromise(rejecter("boo"))
      });

      ArticleActions.get({id: 42});

      asyncAssert(done, function() {
        expect(store.state.error).eql("boo");
      });
    });
  });

  describe("#list()", function() {
    it("should reset error state", function() {
      var store = createStore({
        hasNext: returns(false),
        listArticles: returnPromise(fulfiller([art1, art2]))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.list({});

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      var store = createStore({
        hasNext: returns(false),
        listArticles: returnPromise(fulfiller([art1, art2]))
      });

      ArticleActions.list({});

      asyncAssert(done, function() {
        expect(store.state.articles).eql([art1, art2]);
      });
    });

    it("should update state with an error on failure", function(done) {
      var store = createStore({
        hasNext: returns(false),
        listArticles: returnPromise(rejecter("boo"))
      });

      ArticleActions.list({});

      asyncAssert(done, function() {
        expect(store.state.error).eql("boo");
      });
    });
  });

  describe("#listNext()", function() {
    it("should reset error state", function() {
      var store = createStore({
        hasNext: returns(false),
        listNext: returnPromise(fulfiller([art1, art2]))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.listNext();

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      var store = createStore({
        hasNext: returns(false),
        listNext: returnPromise(fulfiller([art1, art2]))
      });

      ArticleActions.listNext();

      asyncAssert(done, function() {
        expect(store.state.articles).eql([art1, art2]);
      });
    });

    it("should update state with an error on failure", function(done) {
      var store = createStore({
        hasNext: returns(false),
        listNext: returnPromise(rejecter("boo"))
      });

      ArticleActions.listNext();

      asyncAssert(done, function() {
        expect(store.state.error).eql("boo");
      });
    });
  });

  describe("#import()", function() {
    it("should reset error state", function() {
      var store = createStore({
        createBatch: returns({
          createArticle: returns({
            process: sinon.spy()
          })
        })
      });
      sandbox.stub(store, "resetError");

      ArticleActions.import();

      sinon.assert.called(store.resetError);
    });
  });

  describe("#importSuccess()", function() {
    it("should refresh the list", function() {
      sandbox.stub(ArticleActions, "list");

      createStore({}).importSuccess({
        responses: [{
          status: 201,
          body: {
            title: "foo"
          }
        }]
      });

      sinon.assert.calledOnce(ArticleActions.list);
    });
  });

  describe("#importError()", function() {
    it("should update error state", function() {
      var store = createStore({});

      store.importError({message: "boo"});

      expect(store.state.error).eql({message: "boo"});
    });
  });
});
