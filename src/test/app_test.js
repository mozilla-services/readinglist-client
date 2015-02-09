"use strict";

import React from "react/addons";
import sinon from "sinon";
import { expect } from "chai";
import { ArticleActions, ArticleStore, stores } from "../js/flux";
import { $, $$, returns } from "./utils";
import fakeArticleList from "./articles.json";

import App from "../js/components/App";
import ArticleList from "../js/components/ArticleList";
import ArticleEntry from "../js/components/ArticleEntry";
import ArticleForm from "../js/components/ArticleForm";

var TestUtils = React.addons.TestUtils;

var sandbox;

beforeEach(function() {
  sandbox = sinon.sandbox.create();
});

afterEach(function() {
  sandbox.restore();
});

describe("App", function() {
  var articleStore, view;

  beforeEach(function() {
    articleStore = new ArticleStore({});
    stores.register({articleStore: articleStore});
    sandbox.stub(ArticleActions);
    view = TestUtils.renderIntoDocument(<App />);
  });

  afterEach(function() {
    stores.clear();
  });

  it("should request for the article list", function() {
    sinon.assert.calledOnce(ArticleActions.list);
  });

  it("should update component state when store state changes", function() {
    articleStore.setState({articles: fakeArticleList});

    expect(view.state.articles).to.have.length.of(2);
  });
});

describe("ArticleList", function() {
  it("should list articles", function() {
    var view = TestUtils.renderIntoDocument(
      <ArticleList articles={fakeArticleList} />);

    expect($$(view, "li")).to.have.length.of(2);
  });

  it("should render a message when the list is empty", function() {
    var view = TestUtils.renderIntoDocument(
      <ArticleList articles={[]} />);

    expect($$(view, ".list-empty")).not.eql(null);
  });
});

describe("ArticleEntry", function() {
  var view, fakeArticle = {
      "added_by": "niko",
      "added_on": 1423486853721,
      "title": "Libération",
      "unread": true,
      "url": "http://liberation.fr/"
  };

  beforeEach(function() {
    view = TestUtils.renderIntoDocument(<ArticleEntry article={fakeArticle} />);
  });

  it("should render article title", function() {
    expect($(view, "h4").textContent).to.contain(fakeArticle.title);
  });

  it("should render article status", function() {
    expect($(view, "h4").textContent).to.contain("unread");
  });

  it("should render article url", function() {
    expect($(view, "h4 a").href).eql(fakeArticle.url);
  });

  it("should render edit button", function() {
    expect($(view, "button.btn-info").href).not.eql(null);
  });

  it("should render delete button", function() {
    expect($(view, "button.btn-danger").href).not.eql(null);
  });

  it("should call the edit action on click on the edit button", function() {
    sandbox.stub(ArticleActions, "edit");

    TestUtils.Simulate.click($(view, "button.btn-info"));

    sinon.assert.calledOnce(ArticleActions.edit);
    sinon.assert.calledWithExactly(ArticleActions.edit, fakeArticle);
  });

  it("should call the delete action on click on the delete button", function() {
    sandbox.stub(window, "confirm", returns(true));
    sandbox.stub(ArticleActions, "delete");

    TestUtils.Simulate.click($(view, "button.btn-danger"));

    sinon.assert.calledOnce(ArticleActions.delete);
    sinon.assert.calledWithExactly(ArticleActions.delete, fakeArticle);
  });
});

describe("ArticleForm", function() {
  var view, fakeArticle = {
      "added_by": "niko",
      "added_on": 1423486853721,
      "title": "Libération",
      "unread": true,
      "url": "http://liberation.fr/"
  };

  beforeEach(function() {
    view = TestUtils.renderIntoDocument(<ArticleForm />);
  });

  it("should load an empty form by default", function() {
    expect($(view, "input[type=text]").value).eql("");
    expect($(view, "input[type=url]").value).eql("");
  });

  it("should call the create action on create form submit", function() {
    sandbox.stub(ArticleActions, "create");

    TestUtils.Simulate.change($(view, "input[type=text]"), {
      target: {value: "New title"}
    });
    TestUtils.Simulate.change($(view, "input[type=url]"), {
      target: {value: "http://newurl"}
    });
    TestUtils.Simulate.submit($(view, "form"));

    sinon.assert.calledOnce(ArticleActions.create);
    sinon.assert.calledWithExactly(ArticleActions.create, {
      id: undefined,
      added_by: "niko", // XXX fix this
      title: "New title",
      url: "http://newurl"
    });
  });

  it("should fill the form with article fields on changed", function() {
    view.setProps({current: fakeArticle});

    expect($(view, "input[type=text]").value).eql(fakeArticle.title);
    expect($(view, "input[type=url]").value).eql(fakeArticle.url);
  });

  it("should call the update action on edit form submit", function() {
    view.setProps({current: fakeArticle});
    sandbox.stub(ArticleActions, "update");

    TestUtils.Simulate.change($(view, "input[type=text]"), {
      target: {value: "New title"}
    });
    TestUtils.Simulate.change($(view, "input[type=url]"), {
      target: {value: "http://newurl"}
    });
    TestUtils.Simulate.submit($(view, "form"));

    sinon.assert.calledOnce(ArticleActions.update);
    sinon.assert.calledWithExactly(ArticleActions.update, {
      id: undefined,
      added_by: "niko", // XXX fix this
      title: "New title",
      url: "http://newurl"
    });
  });
});
