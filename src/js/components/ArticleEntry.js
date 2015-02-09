"use strict";

import React from "react/addons";
import { ArticleActions } from "../flux";
import { PureRenderMixin } from "react/addons";

export default React.createClass({
  mixins: [PureRenderMixin],

  handleDeleteClick: function() {
    if (confirm("Are you sure?")) {
      ArticleActions.delete(this.props.article);
    }
  },

  render: function() {
    return (
      <div>
        <h4>
          <a href={this.props.article.url}>{this.props.article.title}</a>
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
