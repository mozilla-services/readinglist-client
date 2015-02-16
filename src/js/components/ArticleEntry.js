"use strict";

import React from "react/addons";
import { ArticleActions } from "../flux";
import { addons as ReactAddons } from "react/addons";

import Button from "./Button";

export default React.createClass({
  mixins: [ReactAddons.PureRenderMixin],

  handleOpenClick: function(event) {
    event.preventDefault();
    ArticleActions.open(this.props);
  },

  handleDeleteClick: function() {
    if (confirm("Are you sure?")) {
      ArticleActions.delete(this.props);
    }
  },

  handleEditClick: function() {
    ArticleActions.edit(this.props);
  },

  _formattedAddedOn: function() {
    return new Date(this.props.added_on).toLocaleString();
  },

  render: function() {
    return (
      <div className="ArticleEntry row">
        <h4 className="ArticleEntry__h4 col-md-12">
          <a href={this.props.url} onClick={this.handleOpenClick}>
            {this.props.title}
          </a>
          <sup>{this.props.unread ? "unread" : ""}</sup>
        </h4>
        <p className="ArticleEntry__info col-md-9">
          {`Added by ${this.props.added_by} on ${this._formattedAddedOn()}`}
        </p>
        <div className="ArticleEntry__actions col-md-3 text-right"
             role="group" aria-label="Actions">
          <Button type="info" size="xs" onClick={this.handleEditClick} icon="pencil" />
          <Button type="danger" size="xs" onClick={this.handleDeleteClick} icon="trash"
                  disabled={this.props.status === 2} />
        </div>
      </div>
    );
  }
});
