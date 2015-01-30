"use strict";

import React from "react/addons";

export default React.createClass({
  getDefaultProps: function() {
    return {bodyWrap: true};
  },

  renderPanelBody: function() {
    if (this.props.bodyWrap)
      return <div className="panel-body">{this.props.children}</div>;
    return this.props.children;
  },

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{this.props.title}</h3>
        </div>
        {this.renderPanelBody()}
      </div>
    );
  }
});
