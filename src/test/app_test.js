"use strict";

import React from "react/addons";
import sinon from "sinon";
import { expect } from "chai";
import { ArticleActions, ArticleStore, stores } from "../js/flux";
import App from "../js/components/App";
import { $$ } from "./utils";

var TestUtils = React.addons.TestUtils;

describe("App", function() {
  var sandbox, articleStore, view;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    articleStore = new ArticleStore({});
    stores.register({articleStore: articleStore});
    sandbox.stub(ArticleActions);
    view = TestUtils.renderIntoDocument(<App />);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should load article list on mount", function() {
    articleStore.setState({articles: [{id:1}, {id:2}]});

    expect($$(view, "li")).to.have.length.of(2);
  });
});
