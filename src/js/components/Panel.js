"use strict";

import React from "react/addons";

export default React.createClass({
  getDefaultProps: function() {
    return {bodyWrap: true, actionButtons: []};
  },

  // XXX move to own component
  renderPanelBody: function() {
    if (this.props.bodyWrap)
      return <div className="panel-body">{this.props.children}</div>;
    return this.props.children;
  },

  // XXX move to own component
  renderActionButtons: function() {
    return (
      <div className="panel-actions col-md-3 text-right">{
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        this.props.actionButtons.reduce((buttons, button, i) => {
          buttons[`b${i}`] = button;
          return buttons;
        }, {})
      }</div>
    );
  },

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="row">
            <h3 className="panel-title col-md-9">{this.props.title}</h3>
            {this.renderActionButtons()}
          </div>
        </div>
        {this.renderPanelBody()}
      </div>
    );
  }
});
