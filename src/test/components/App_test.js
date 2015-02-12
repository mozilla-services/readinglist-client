"use strict";

import React from "react/addons";
import sinon from "sinon";
import { expect } from "chai";
import {
  AuthActions,
  ArticleActions,
  AuthStore,
  ArticleStore,
  stores
} from "../../js/flux";
import fakeArticleList from "../fixtures/articles.json";

import App from "../../js/components/App";

var TestUtils = React.addons.TestUtils;

describe("App tests", function() {
  var sandbox, authStore, articleStore;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    authStore = new AuthStore({});
    articleStore = new ArticleStore({});
    stores.register({
      authStore: authStore,
      articleStore: articleStore
    });
  });

  afterEach(function() {
    stores.clear();
    sandbox.restore();
  });

  describe("App", function() {
    var view;

    beforeEach(function() {
      sandbox.stub(ArticleActions);
      sandbox.stub(AuthActions);
      view = TestUtils.renderIntoDocument(<App />);
    });

    it("should request for the article list", function() {
      sinon.assert.calledOnce(ArticleActions.list);
    });

    it("should update component state when store state changes", function() {
      articleStore.setState({articles: fakeArticleList});

      expect(view.state.articles).to.have.length.of(2);
    });
  });
});
