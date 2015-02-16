"use strict";

import React from "react/addons";
import { expect } from "chai";
import { $, $$ } from "../utils";

import Panel from "../../js/components/Panel";

var TestUtils = React.addons.TestUtils;

describe("Panel tests", function() {
  it("should render a title", function() {
    var view = TestUtils.renderIntoDocument(<Panel title="Plop" />);

    expect($(view, ".panel-title").textContent).eql("Plop");
  });

  it("should render children", function() {
    var view = TestUtils.renderIntoDocument(<Panel>Plop</Panel>);

    expect($(view, ".panel-body").textContent).eql("Plop");
  });

  it("should render action buttons", function() {
    var view = TestUtils.renderIntoDocument(<Panel actionButtons={[
      <button>buttonA</button>,
      <button>buttonB</button>,
    ]} />);

    expect($$(view, "button")).to.have.length.of(2);
    expect($$(view, "button")[0].textContent).eql("buttonA");
    expect($$(view, "button")[1].textContent).eql("buttonB");
  });
});
