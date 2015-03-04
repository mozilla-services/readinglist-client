"use strict";

import React from "react/addons";
import { expect } from "chai";

import Button from "../../js/components/Button";

var TestUtils = React.addons.TestUtils;

describe("Button tests", function() {
  it("should render a button element", function() {
    var view = TestUtils.renderIntoDocument(<Button />);

    expect(view.getDOMNode().tagName.toLowerCase()).eql("button");
  });

  it("should contain base class names", function() {
    var view = TestUtils.renderIntoDocument(<Button />);

    var classList = view.getDOMNode().classList;

    expect(classList.contains("btn")).eql(true);
  });

  it("should merge passed class names", function() {
    var view = TestUtils.renderIntoDocument(<Button className="foo bar" />);

    var classList = view.getDOMNode().classList;

    expect(classList.contains("btn")).eql(true);
    expect(classList.contains("foo")).eql(true);
    expect(classList.contains("bar")).eql(true);
  });

  it("should render a submit button", function() {
    var view = TestUtils.renderIntoDocument(<Button type="submit" />);

    expect(view.getDOMNode().getAttribute("type")).eql("submit");
  });

  it("should propagate html button element attributes", function() {
    var view = TestUtils.renderIntoDocument(<Button title="plop" />);

    expect(view.getDOMNode().getAttribute("title")).eql("plop");
  });
});
