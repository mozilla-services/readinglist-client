"use strict";

describe("Test setup", function() {
  it("should handle promises", function() {
    return new Promise(function(fulfill) {
      fulfill(1);
    }).should.eventually.eql(1);
  });
});
