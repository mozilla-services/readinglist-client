"use strict";

var React = require("react");
// Load 6to5 polyfills http://6to5.org/docs/usage/polyfill/
require("6to5/polyfill");

var App = React.createClass({
  getInitialState: function() {
    return {appName: "Nope."};
  },

  componentDidMount: function() {
    this.props.api.hello().then(function(res) {
      this.setState({appName: res.entity.hello});
    }.bind(this));
  },

  render: function() {
    return <div>
      <h1>{this.state.appName}</h1>
    </div>;
  }
});

module.exports = App;
