"use strict";

import React from "react/addons";
import { addons as ReactAddons } from "react/addons";

import Icon from "./Icon";

export default React.createClass({
  mixins: [ReactAddons.PureRenderMixin],

  getDefaultProps: function() {
    return {
      className: "btn",
      kind: "default",
      type: "button",
      size: "md",
      primary: false,
      submit: false
    };
  },

  render: function() {
    var classes = this.props.className.split(" ").reduce(function(list, cls) {
      list[cls] = true;
      return list;
    }, {btn: true});

    if (this.props.kind) {
      classes["btn-" + this.props.kind] = true;
    }
    if (this.props.size) {
      classes["btn-" + this.props.size] = true;
    }

    var mergedProps = Object.assign({}, this.props, {
      className: React.addons.classSet(classes)
    });

    return (
      <button {...mergedProps}>
        {this.props.icon ? <Icon type={this.props.icon} /> : null}
        {this.props.label ? <span>{this.props.label}</span> : null}
      </button>
    );
  }
});
