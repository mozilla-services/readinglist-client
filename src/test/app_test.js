"use strict";

var expect = require("chai").expect;

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var App = require("../js/app");
var $ = require("./utils").$;

describe("App", function() {
  var api, view;

  beforeEach(function() {
    api = {hello: () => new Promise(r => r("foo"))};
    view = TestUtils.renderIntoDocument(<App api={api} />);
  });

  it("should be mountable on local DOM", function() {
    expect(view.getDOMNode()).not.eql(null);
  });

  it("should render the app name", function() {
    setTimeout(() => expect($(view, "h1").textContent).eql("foo"));
  });
});
