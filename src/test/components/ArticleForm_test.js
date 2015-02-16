"use strict";

import React from "react/addons";
import sinon from "sinon";
import { expect } from "chai";
import { ArticleActions } from "../../js/flux";
import { $ } from "../utils";

import ArticleForm from "../../js/components/ArticleForm";

var TestUtils = React.addons.TestUtils;

describe("ArticleForm tests", function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
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
      view = TestUtils.renderIntoDocument(<ArticleForm show={true} />);
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
});
