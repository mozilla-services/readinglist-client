"use strict";

import React from "react";

export default React.createClass({
  render: function() {
    return (
      <div className="alert alert-warning">
        <p><strong>{this.props.title}</strong></p>
        <div>{this.props.children}</div>
      </div>
    );
  }
});
