"use strict";

import React from "react/addons";

import Icon from "./Icon";

export default React.createClass({
  getDefaultProps: function() {
    return {type: "default", size: "md", primary: false};
  },

  render: function() {
    var classes = {btn: true};
    if (this.props.type) classes["btn-" + this.props.type] = true;
    if (this.props.size) classes["btn-" + this.props.size] = true;
    return (
      <button type="button" className={React.addons.classSet(classes)} {...this.props}>
        {this.props.icon ? <Icon type={this.props.icon} /> : null}
        {this.props.label ? <span>{this.props.label}</span> : null}
      </button>
    );
  }
});
