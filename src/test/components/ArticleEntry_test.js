"use strict";

import React from "react/addons";
import sinon from "sinon";
import { expect } from "chai";
import { ArticleActions } from "../../js/flux";
import { $, returns } from "../utils";

import ArticleEntry from "../../js/components/ArticleEntry";

var TestUtils = React.addons.TestUtils;

describe("ArticleEntry tests", function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("ArticleEntry", function() {
    var view, fakeArticle = {
        "id": "id42",
        "added_by": "niko",
        "added_on": 1423486853721,
        "title": "Libération",
        "unread": true,
        "url": "http://liberation.fr/"
    };

    beforeEach(function() {
      view = TestUtils.renderIntoDocument(<ArticleEntry {...fakeArticle} />);
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
      expect($(view, "button.btn-edit").href).not.eql(null);
    });

    it("should render delete button", function() {
      expect($(view, "button.btn-delete").href).not.eql(null);
    });

    describe("Action buttons", function() {
      it("should call the open action when clicking the title", function() {
        sandbox.stub(ArticleActions, "open");

        TestUtils.Simulate.click($(view, "h4 a"));

        sinon.assert.calledOnce(ArticleActions.open);
        sinon.assert.calledWithExactly(ArticleActions.open, fakeArticle);
      });

      it("should call the edit action on click on the edit button", function() {
        sandbox.stub(ArticleActions, "edit");

        TestUtils.Simulate.click($(view, "button.btn-edit"));

        sinon.assert.calledOnce(ArticleActions.edit);
        sinon.assert.calledWithExactly(ArticleActions.edit, fakeArticle);
      });

      it("should call the delete action on click on the delete button", function() {
        sandbox.stub(window, "confirm", returns(true));
        sandbox.stub(ArticleActions, "delete");

        TestUtils.Simulate.click($(view, "button.btn-delete"));

        sinon.assert.calledOnce(ArticleActions.delete);
        sinon.assert.calledWithExactly(ArticleActions.delete, fakeArticle);
      });

      it("should call the markAsRead action on click on the Mark As Read button",
        function() {
          sandbox.stub(ArticleActions, "markAsRead");

          TestUtils.Simulate.click($(view, "button.btn-mark-as-read"));

          sinon.assert.calledOnce(ArticleActions.markAsRead);
          sinon.assert.calledWithMatch(ArticleActions.markAsRead, {id: fakeArticle.id});
        });

      it("should call the archive action on click on the Mark As Read button",
        function() {
          sandbox.stub(ArticleActions, "archive");

          TestUtils.Simulate.click($(view, "button.btn-archive"));

          sinon.assert.calledOnce(ArticleActions.archive);
          sinon.assert.calledWithMatch(ArticleActions.archive, {id: fakeArticle.id});
        });
    });
  });
});
