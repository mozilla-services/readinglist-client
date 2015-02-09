"use strict";

import React from "react/addons";

export default React.createClass({
  render: function() {
    return (
      <span className={`glyphicon glyphicon-${this.props.type}`}
            aria-hidden="true" />
    );
  }
});
