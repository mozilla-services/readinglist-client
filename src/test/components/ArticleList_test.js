"use strict";

import React from "react/addons";
import sinon from "sinon";
import { expect } from "chai";
import { ArticleActions } from "../../js/flux";
import { $, $$, findELByContent } from "../utils";
import fakeArticleList from "../fixtures/articles.json";

import { ArticleConstants } from "../../js/api";
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

    describe("Filters", function() {
      var view, findFilterButton;

      beforeEach(function() {
        sandbox.stub(ArticleActions, "list");
        view = TestUtils.renderIntoDocument(<ArticleList
          articles={[]}
          filters={{
            unread: false,
            status: ArticleConstants.status.ARCHIVED,
            _sort: ArticleConstants.sort.LAST_MODIFIED_DESC,
          }}
        />);
        findFilterButton = findELByContent.bind(null, view, ".list-filters button");
      });

      describe("unread filter", function() {
        it("should reflect unread filter state", function() {
          // Note: The `btn-info` class highlights the filter button.
          expect(findFilterButton("Read").classList.contains("btn-info")).eql(true);
          expect(findFilterButton("Unread").classList.contains("btn-info")).eql(false);
        });

        it("should list read articles", function() {
          TestUtils.Simulate.click(findFilterButton("Read"));

          sinon.assert.calledOnce(ArticleActions.list);
          sinon.assert.calledWithExactly(ArticleActions.list, {unread: false});
        });

        it("should list unread articles", function() {
          TestUtils.Simulate.click(findFilterButton("Unread"));

          sinon.assert.calledOnce(ArticleActions.list);
          sinon.assert.calledWithExactly(ArticleActions.list, {unread: true});
        });
      });

      describe("status filter", function() {
        it("should reflect status filter state", function() {
          // Note: The `btn-info` class highlights the filter button.
          expect(findFilterButton("Default").classList.contains("btn-info")).eql(false);
          expect(findFilterButton("Archived").classList.contains("btn-info")).eql(true);
          expect(findFilterButton("Deleted").classList.contains("btn-info")).eql(false);
        });

        it("should list default articles", function() {
          TestUtils.Simulate.click(findFilterButton("Default"));

          sinon.assert.calledOnce(ArticleActions.list);
          sinon.assert.calledWithExactly(ArticleActions.list, {
            status: ArticleConstants.status.DEFAULT
          });
        });

        it("should list archived articles", function() {
          TestUtils.Simulate.click(findFilterButton("Archived"));

          sinon.assert.calledOnce(ArticleActions.list);
          sinon.assert.calledWithExactly(ArticleActions.list, {
            status: ArticleConstants.status.ARCHIVED
          });
        });

        it("should list deleted articles", function() {
          TestUtils.Simulate.click(findFilterButton("Deleted"));

          sinon.assert.calledOnce(ArticleActions.list);
          sinon.assert.calledWithExactly(ArticleActions.list, {
            status: ArticleConstants.status.DELETED
          });
        });
      });

      describe("sort filters", function() {
        it("should reflect sort filter state", function() {
          // Note: The `btn-info` class highlights the filter button.
          expect(findFilterButton("Last modified").classList.contains("btn-info")).eql(true);
          expect(findFilterButton("Date added").classList.contains("btn-info")).eql(false);
          expect(findFilterButton("Title").classList.contains("btn-info")).eql(false);
        });

        it("should order by last_modified", function() {
          TestUtils.Simulate.click(findFilterButton("Last modified"));

          sinon.assert.calledOnce(ArticleActions.list);
          sinon.assert.calledWithExactly(ArticleActions.list, {
            _sort: ArticleConstants.sort.LAST_MODIFIED_DESC
          });
        });

        it("should order by added_on", function() {
          TestUtils.Simulate.click(findFilterButton("Date added"));

          sinon.assert.calledOnce(ArticleActions.list);
          sinon.assert.calledWithExactly(ArticleActions.list, {
            _sort: ArticleConstants.sort.ADDED_ON_DESC
          });
        });

        it("should order by title", function() {
          TestUtils.Simulate.click(findFilterButton("Title"));

          sinon.assert.calledOnce(ArticleActions.list);
          sinon.assert.calledWithExactly(ArticleActions.list, {
            _sort: ArticleConstants.sort.TITLE_ASC
          });
        });
      });
    });
  });
});
