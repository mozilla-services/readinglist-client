"use strict";

//import { expect } from "chai";
import sinon from "sinon";
//import { returns } from "./testutils";

import Provider from "../js/provider";

var article = {
  id: "id1",
  title: "fake1",
  url: "http://fake1",
  archived: false,
  unread: false
};

describe("Local", function() {
  var sandbox, local, api;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe("get online()", function() {
    it("description", function() {
      // body...
    });
  });
});
