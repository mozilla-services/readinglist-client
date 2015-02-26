"use strict";

import React from "react/addons";
import sinon from "sinon";
import { expect } from "chai";
import { $ } from "../utils";

import { ArticleActions } from "../../js/flux";

import Viewer from "../../js/components/Viewer";

var TestUtils = React.addons.TestUtils;

describe("Viewer tests", function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should render fetching message by default", function() {
    var view = TestUtils.renderIntoDocument(<Viewer />);

    expect(view.getDOMNode().textContent).match(/Loading/);
  });

  it("should render provided contents", function() {
    var view = TestUtils.renderIntoDocument(<Viewer contents="<em>hello</em>" />);

    expect($(view, "em").textContent).eql("hello");
  });

  it("should update iframe src when url prop changes", function() {
    var view = TestUtils.renderIntoDocument(<Viewer contents="<em>hello</em>" />);

    view.setProps({contents: "<em>yo</em>"});

    expect($(view, "em").textContent).eql("yo");
  });

  it("should render a close button", function() {
    var view = TestUtils.renderIntoDocument(<Viewer />);

    expect($(view, "button.btn-close")).not.eql(null);
  });

  it("should render a mark-as-read button", function() {
    var view = TestUtils.renderIntoDocument(<Viewer />);

    expect($(view, "button.btn-mark-as-read")).not.eql(null);
  });

  it("should mark article as read when clicking the mark-as-read btn", function() {
    sandbox.stub(ArticleActions, "markAsRead");
    var view = TestUtils.renderIntoDocument(<Viewer id={42} />);

    TestUtils.Simulate.click($(view, "button.btn-mark-as-read"));

    sinon.assert.calledOnce(ArticleActions.markAsRead);
    sinon.assert.calledWithExactly(ArticleActions.markAsRead, {id: 42});
  });
});
