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
      var view = TestUtils.renderIntoDocument(<ArticleList articles={fakeArticleList} />);

      expect($$(view, "li")).to.have.length.of(2);
    });

    it("should render an add button", function() {
      var view = TestUtils.renderIntoDocument(<ArticleList articles={[]} />);

      expect($(view, "button.btn-add")).not.eql(null);
    });

    it("should trigger the add action when clicking on the add button", function() {
      sandbox.stub(ArticleActions, "add");
      var view = TestUtils.renderIntoDocument(<ArticleList articles={[]} />);

      TestUtils.Simulate.click($(view, "button.btn-add"));

      sinon.assert.calledOnce(ArticleActions.add);
    });

    it("should render a message when the list is empty", function() {
      var view = TestUtils.renderIntoDocument(<ArticleList articles={[]} />);

      expect($(view, ".list-empty")).not.eql(null);
    });

    it("should render an import button when the list is empty", function() {
      var view = TestUtils.renderIntoDocument(<ArticleList articles={[]} />);

      expect($(view, "button.btn-import")).not.eql(null);
    });

    it("should not render an import button when the list is non-empty", function() {
      var view = TestUtils.renderIntoDocument(<ArticleList articles={fakeArticleList} />);

      expect($(view, "button.btn-import")).eql(null);
    });

    it("should trigger the import action when clicking on the import button", function() {
      sandbox.stub(ArticleActions, "import");
      var view = TestUtils.renderIntoDocument(<ArticleList articles={[]} />);

      TestUtils.Simulate.click($(view, "button.btn-import"));

      sinon.assert.calledOnce(ArticleActions.import);
    });

    it("should hide a next page link", function() {
      var view = TestUtils.renderIntoDocument(<ArticleList articles={[]} />);

      expect($(view, ".list-pages")).eql(null);
    });

    it("should render a next page link", function() {
      var view = TestUtils.renderIntoDocument(<ArticleList articles={[]} hasNext={true} />);

      expect($(view, ".list-pages")).not.eql(null);
    });

    it("should trigger the listNext action on next button click", function() {
      sandbox.stub(ArticleActions, "listNext");
      var view = TestUtils.renderIntoDocument(<ArticleList articles={[]} hasNext={true} />);

      TestUtils.Simulate.click($(view, ".list-pages button"));

      sinon.assert.calledOnce(ArticleActions.listNext);
    });

    it("should hightlight selected article in the list", function() {
      var view = TestUtils.renderIntoDocument(
        <ArticleList articles={fakeArticleList} selectedId={fakeArticleList[1].id} />);

      expect($(view, ".list-group-item.active h4 a").textContent).eql(fakeArticleList[1].title);
    });

    it("shouldn't highlight any entry when no article is selected", function() {
      var view = TestUtils.renderIntoDocument(<ArticleList articles={fakeArticleList} />);

      expect($(view, ".list-group-item.active")).eql(null);
    });

    it("should render the number of total records", function() {
      var view = TestUtils.renderIntoDocument(
        <ArticleList articles={fakeArticleList} totalRecords={12} />);

      expect($(view, ".badge").textContent).eql("12");
    });
  });
});
