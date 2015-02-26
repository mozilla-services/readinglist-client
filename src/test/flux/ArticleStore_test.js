"use strict";

import { expect } from "chai";
import sinon from "sinon";

import { asyncAssert, returns } from "../utils";

import { ArticleConstants } from "../../js/api";
import { Dispatcher, ArticleStore, ArticleActions } from "../../js/flux";

describe("ArticleStore", function() {
  var sandbox;

  var art1 = {id: 1, url: "http://fake1", title: "Fake1", added_by: "User1"};
  var art2 = {id: 2, url: "http://fake2", title: "Fake2", added_by: "User2"};

  function createStore(api, contentManager, options) {
    return new ArticleStore(api, contentManager, options);
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
        createArticle: returns(Promise.resolve(art1))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.create(art1);

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      sandbox.stub(ArticleActions, "list");
      createStore({createArticle: returns(Promise.resolve(art1))});

      ArticleActions.create(art1);

      asyncAssert(done, function() {
        sinon.assert.called(ArticleActions.list);
      });
    });

    it("should update state with an error on failure", function(done) {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({createArticle: returns(Promise.reject("boo"))});

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

    it("should filter out deleted articles", function() {
      store.updateArticleList([art1, art2, {
        id: 3,
        url: "http://fake3",
        title: "Fake3",
        added_by: "User3",
        status: ArticleConstants.status.DELETED
      }]);

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
        updateArticle: returns(Promise.resolve(art1))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.update(art1);

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      sandbox.stub(ArticleActions, "list");
      createStore({updateArticle: returns(Promise.resolve(art1))});

      ArticleActions.update(art1);

      asyncAssert(done, function() {
        sinon.assert.called(ArticleActions.list);
      });
    });

    it("should disable edit mode on success", function(done) {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({updateArticle: returns(Promise.resolve(art1))});
      store.setState({edit: true, current: art1});

      ArticleActions.update(art1);

      asyncAssert(done, function() {
        expect(store.state.edit).eql(false);
      });
    });

    it("should update state with an error on failure", function(done) {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({
        updateArticle: returns(Promise.reject("boo"))
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
        deleteArticle: returns(Promise.resolve(art1))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.delete(art1);

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      sandbox.stub(ArticleActions, "list");
      createStore({deleteArticle: returns(Promise.resolve(art1))},
                  {drop: sinon.spy()});

      ArticleActions.delete(art1);

      asyncAssert(done, function() {
        sinon.assert.called(ArticleActions.list);
      });
    });

    it("should disable edit mode on success", function(done) {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({deleteArticle: returns(Promise.resolve(art1))},
                              {drop: sinon.spy()});
      store.setState({edit: true, current: art1});

      ArticleActions.delete(art1);

      asyncAssert(done, function() {
        expect(store.state.edit).eql(false);
      });
    });

    it("should update state with an error on failure", function(done) {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({deleteArticle: returns(Promise.reject("boo"))},
                              {drop: sinon.spy()});

      ArticleActions.delete(art1);

      asyncAssert(done, function() {
        expect(store.state.error).eql("boo");
      });
    });

    it("should update state current article if just deleted", function(done) {
      var store = createStore({deleteArticle: returns(Promise.resolve(art1))},
                              {drop: sinon.spy()});
      store.setState({current: art1});

      ArticleActions.delete(art1);

      asyncAssert(done, function() {
        expect(store.state.current).to.be.a("null");
      });
    });

    it("should drop article contents from content manager", function(done) {
      var drop = sinon.spy();
      var store = createStore({deleteArticle: returns(Promise.resolve(art1))},
                              {drop: drop});
      store.setState({current: art1});

      ArticleActions.delete(art1);

      asyncAssert(done, function() {
        sinon.assert.calledOnce(drop);
        sinon.assert.calledWithExactly(drop, art1);
      });
    });
  });

  describe("#get()", function() {
    it("should reset error state", function() {
      var store = createStore({
        getArticle: returns(Promise.resolve(art1))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.get({id: 42});

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      var store = createStore({
        getArticle: returns(Promise.resolve(art1))
      });

      ArticleActions.get({id: 42});

      asyncAssert(done, function() {
        expect(store.state.current).eql(art1);
      });
    });

    it("should update state with an error on failure", function(done) {
      var store = createStore({
        getArticle: returns(Promise.reject("boo"))
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
        listArticles: returns(Promise.resolve([art1, art2]))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.list({});

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      var store = createStore({
        hasNext: returns(false),
        listArticles: returns(Promise.resolve([art1, art2]))
      });

      ArticleActions.list({});

      asyncAssert(done, function() {
        expect(store.state.articles).eql([art1, art2]);
      });
    });

    it("should update state with an error on failure", function(done) {
      var store = createStore({
        hasNext: returns(false),
        listArticles: returns(Promise.reject("boo"))
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
        listNext: returns(Promise.resolve([art1, art2]))
      });
      sandbox.stub(store, "resetError");

      ArticleActions.listNext();

      sinon.assert.called(store.resetError);
    });

    it("should refresh the list on success", function(done) {
      var store = createStore({
        hasNext: returns(false),
        listNext: returns(Promise.resolve([art1, art2]))
      });

      ArticleActions.listNext();

      asyncAssert(done, function() {
        expect(store.state.articles).eql([art1, art2]);
      });
    });

    it("should update state with an error on failure", function(done) {
      var store = createStore({
        hasNext: returns(false),
        listNext: returns(Promise.reject("boo"))
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

  describe("#open()", function() {
    var store, load;

    beforeEach(function() {
      load = sandbox.spy();
      store = createStore({}, {load: load});
    });

    it("should set current article state", function() {
      store.open(art1);

      expect(store.state.current).eql(art1);
    });

    it("should switch off edit mode", function() {
      store.open(art1);

      expect(store.state.edit).eql(false);
    });

    it("should reset current contents", function() {
      store.setState({currentContents: "foo"});

      store.open(art1);

      expect(store.state.currentContents).eql(null);
    });

    it("should load article contents", function() {
      store.open(art1);

      sinon.assert.calledOnce(load);
      sinon.assert.calledWithExactly(load, art1);
    });
  });

  describe("#openSuccess()", function() {
    it("should update currentContents state", function() {
      var store = createStore({}, {});

      store.openSuccess("foo");

      expect(store.state.currentContents).eql("foo");
    });
  });

  describe("#openError()", function() {
    it("should set error", function() {
      var store = createStore({}, {});

      store.openError("boo");

      expect(store.state.error).eql("boo");
    });
  });

  describe("#markAsRead()", function() {
    it("should return a promise", function() {
      var store = createStore({
        updateArticle: returns(Promise.resolve(art1))
      }, {});

      return store.markAsRead(art1).should.become(art1);
    });

    it("should update article with operation info", function() {
      var spy = sandbox.spy();
      var store = createStore({updateArticle: spy}, {}, {
        clientIdentifier: "fake-client-identifier"
      });

      store.markAsRead(art1);

      sinon.assert.calledOnce(store.api.updateArticle);
      sinon.assert.calledWithMatch(store.api.updateArticle, {
        id: art1.id,
        marked_read_by: "fake-client-identifier",
        unread: false
      });
    });
  });

  describe("#markAsReadSuccess()", function() {
    it("should refresh article list", function() {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({}, {});

      store.markAsReadSuccess();

      sinon.assert.calledOnce(ArticleActions.list);
    });
  });

  describe("#markAsReadError()", function() {
    it("should set error", function() {
      var store = createStore({}, {});

      store.markAsReadError("boo");

      expect(store.state.error).eql("boo");
    });
  });

  describe("#archive()", function() {
    it("should return a promise", function() {
      var store = createStore({
        updateArticle: returns(Promise.resolve(art1))
      }, {});

      return store.archive(art1).should.become(art1);
    });

    it("should update article with operation info", function() {
      var spy = sandbox.spy();
      var store = createStore({updateArticle: spy}, {});

      store.archive(art1);

      sinon.assert.calledOnce(store.api.updateArticle);
      sinon.assert.calledWithMatch(store.api.updateArticle, {
        id: art1.id,
        status: ArticleConstants.status.ARCHIVED
      });
    });
  });

  describe("#archiveSuccess()", function() {
    it("should refresh article list", function() {
      sandbox.stub(ArticleActions, "list");
      var store = createStore({}, {});

      store.archiveSuccess();

      sinon.assert.calledOnce(ArticleActions.list);
    });
  });

  describe("#archiveError()", function() {
    it("should set error", function() {
      var store = createStore({}, {});

      store.archiveError("boo");

      expect(store.state.error).eql("boo");
    });
  });
});
