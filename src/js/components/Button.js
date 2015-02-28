"use strict";

import React from "react/addons";
import { addons as ReactAddons } from "react/addons";

import Icon from "./Icon";

export default React.createClass({
  mixins: [ReactAddons.PureRenderMixin],

  getDefaultProps: function() {
    return {className: "btn", type: "default", size: "md", primary: false};
  },

  render: function() {
    var classes = this.props.className.split(" ").reduce(function(classes, cls) {
      classes[cls] = true;
      return classes;
    }, {btn: true});

    if (this.props.type) {
      classes["btn-" + this.props.type] = true;
    }
    if (this.props.size) {
      classes["btn-" + this.props.size] = true;
    }

    var mergedProps = Object.assign({}, this.props, {
      className: React.addons.classSet(classes)
    });

    return (
      <button type="button" {...mergedProps}>
        {this.props.icon ? <Icon type={this.props.icon} /> : null}
        {this.props.label ? <span>{this.props.label}</span> : null}
      </button>
    );
  }
});
