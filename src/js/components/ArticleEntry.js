"use strict";

import React from "react/addons";
import { ArticleActions } from "../flux";

export default React.createClass({
  handleDeleteClick: function() {
    if (confirm("Are you sure?")) {
      ArticleActions.delete(this.props.article);
    }
  },

  render: function() {
    return (
      <div>
        <h4>
          <a href={this.props.article.resolved_url}>
            {this.props.article.resolved_title}
          </a>
          {" "}
          <sup>{this.props.article.unread ? "unread" : ""}</sup>
        </h4>
        <p>
          Added by {this.props.article.added_by}
          {" "}
          on {new Date(this.props.article.added_on).toLocaleString()} |
          <button onClick={this.handleDeleteClick}>Delete</button>
        </p>
      </div>
    );
  }
});
