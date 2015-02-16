"use strict";

import React from "react/addons";
import { expect } from "chai";
import { $ } from "../utils";

import Viewer from "../../js/components/Viewer";
import { DEFAULT_IFRAME_SRC_URL } from "../../js/components/Viewer";

var TestUtils = React.addons.TestUtils;

describe("Viewer tests", function() {
  it("should load the iframe with default src url", function() {
    var view = TestUtils.renderIntoDocument(<Viewer />);

    expect($(view, "iframe").src).eql(DEFAULT_IFRAME_SRC_URL);
  });

  it("should load the iframe with article url when provided", function() {
    var view = TestUtils.renderIntoDocument(<Viewer url="http://invalid/" />);

    expect($(view, "iframe").src).eql("http://invalid/");
  });

  it("should update iframe src when url prop changes", function() {
    var view = TestUtils.renderIntoDocument(<Viewer url="http://invalid1/" />);

    view.setProps({url: "http://invalid2/"});

    expect($(view, "iframe").src).eql("http://invalid2/");
  });

  it("should render a close button", function() {
    var view = TestUtils.renderIntoDocument(<Viewer />);

    expect($(view, "button.btn-close")).not.eql(null);
  });
});
