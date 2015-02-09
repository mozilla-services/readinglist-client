"use strict";

import React from "react/addons";
import { ArticleActions } from "../flux";
import { addons as ReactAddons } from "react/addons";

import Button from "./Button";

export default React.createClass({
  mixins: [ReactAddons.PureRenderMixin],

  handleDeleteClick: function() {
    if (confirm("Are you sure?")) {
      ArticleActions.delete(this.props.article);
    }
  },

  handleEditClick: function() {
    ArticleActions.edit(this.props.article);
  },

  render: function() {
    return (
      <div className="ArticleEntry row">
        <h4 className="ArticleEntry__h4 col-md-12">
          <a href={this.props.article.url}>{this.props.article.title}</a>
          <sup>{this.props.article.unread ? "unread" : ""}</sup>
        </h4>
        <p className="ArticleEntry__info col-md-9">
          Added by {this.props.article.added_by}{" "}
          on {new Date(this.props.article.added_on).toLocaleString()}
        </p>
        <div className="ArticleEntry__actions col-md-3 btn-group" role="group" aria-label="Actions">
          <Button type="info" size="xs" onClick={this.handleEditClick} icon="pencil" />
          <Button type="danger" size="xs" onClick={this.handleDeleteClick} icon="trash"
                  disabled={this.props.article.status === 2} />
        </div>
      </div>
    );
  }
});
