"use strict";

var React = require('react');

var App = React.createClass({
  render: function() {
    return (
      <div>Hello Readinglist</div>
    );
  }
});

React.render(<App/>, document.querySelector("#app"));
