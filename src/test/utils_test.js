"use strict";

import { expect } from "chai";
import * as utils from "../js/utils";

describe("utils", function() {
  describe("#waterfall", function() {
    it("should chain result through promises", function() {
      return utils.waterfall([
        ()  => Promise.resolve(42),
        (x) => Promise.resolve(x),
        (x) => Promise.resolve(x)
      ]).should.become(42);
    });

    it("should accept an init value", function() {
      return utils.waterfall([
        (x) => Promise.resolve(x),
        (x) => Promise.resolve(x),
        (x) => Promise.resolve(x)
      ], 42).should.become(42);
    });
  });

  describe("toIDBObj", function() {
    it("should map whitelisted boolean props to numbers", function() {
      expect(utils.toIDBObj({foo: true}, ["foo"])).eql({foo: 1});
    });

    it("should not map boolean values to numbers by default", function() {
      expect(utils.toIDBObj({foo: true})).eql({foo: true});
    });
  });

  describe("fromIDBObj", function() {
    it("should map whitelisted boolean props to booleans", function() {
      expect(utils.fromIDBObj({foo: 1}, ["foo"])).eql({foo: true});
    });

    it("should not map boolean values to numbers by default", function() {
      expect(utils.fromIDBObj({foo: 1})).eql({foo: 1});
    });
  });
});
