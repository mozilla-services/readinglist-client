"use strict";

var React = require("react");

class Greeter {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hello ${this.name}!`;
  }
}

var App = React.createClass({
  render: function() {
    return (
      <div>{new Greeter("readinglist").greet()}</div>
    );
  }
});

module.exports = App;
