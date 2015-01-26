"use strict";

var expect = require("chai").expect;

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var App = require("../js/app");

describe("App", function() {
  it("should be mountable on local DOM", function() {
    var view = TestUtils.renderIntoDocument(<App/>);

    expect(view.getDOMNode()).not.eql(null);
  });
});
