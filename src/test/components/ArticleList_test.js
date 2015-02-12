"use strict";

import React from "react/addons";
import sinon from "sinon";
import { expect } from "chai";
import { ArticleActions } from "../../js/flux";
import { $, $$ } from "../utils";
import fakeArticleList from "../fixtures/articles.json";

import ArticleList from "../../js/components/ArticleList";

var TestUtils = React.addons.TestUtils;

describe("ArticleList tests", function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
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

      expect($(view, ".list-empty")).not.eql(null);
    });

    it("should render an import button when the list is empty", function() {
      var view = TestUtils.renderIntoDocument(
        <ArticleList articles={[]} />);

      expect($(view, ".list-empty button")).not.eql(null);
    });

    it("should not render an import button when the list is non-empty", function() {
      var view = TestUtils.renderIntoDocument(
        <ArticleList articles={fakeArticleList} />);

      expect($(view, ".list-empty button")).eql(null);
    });

    it("should trigger the import action when clicking on the import button", function() {
      sandbox.stub(ArticleActions, "import");
      var view = TestUtils.renderIntoDocument(
        <ArticleList articles={[]} />);

      TestUtils.Simulate.click($(view, ".list-empty button"));

      sinon.assert.calledOnce(ArticleActions.import);
    });
  });
});
