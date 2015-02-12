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
});
