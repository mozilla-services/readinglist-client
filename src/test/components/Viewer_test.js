"use strict";

import React from "react/addons";
import { expect } from "chai";
import { $ } from "../utils";

import Viewer from "../../js/components/Viewer";

var TestUtils = React.addons.TestUtils;

describe("Viewer tests", function() {
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
});
