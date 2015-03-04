"use strict";

import React from "react/addons";
import { ArticleActions } from "../flux";
import { addons as ReactAddons } from "react/addons";

import Button from "./Button";

var EditButton = React.createClass({
  render: function() {
    return (
      <Button className="btn-edit" kind="default" size="xs" title="Edit"
              onClick={this.props.onClick} icon="pencil" />
    );
  }
});

var DeleteButton = React.createClass({
  render: function() {
    return (
      <Button className="btn-delete" kind="danger" size="xs" icon="trash"
              title="Delete" onClick={this.props.onClick} disabled={this.props.checked} />
    );
  }
});

var MarkAsReadButton = React.createClass({
  onClick: function() {
    ArticleActions[this.props.unread ? "markAsRead" : "markAsUnread"]({
      id: this.props.id
    });
  },

  render: function() {
    return (
      <Button className="btn-mark-as-read" kind="default" size="xs"
              title={`Mark as ${this.props.unread ? "read" : "unread"}`}
              icon={this.props.unread ? "eye-close" : "eye-open"}
              onClick={this.onClick} />
    );
  }
});

var ArchiveButton = React.createClass({
  render: function() {
    return (
      <Button className="btn-archive" kind="default" title="Archive"
              size="xs" icon="save-file" onClick={this.props.onClick} />
    );
  }
});

export default React.createClass({
  mixins: [ReactAddons.PureRenderMixin],

  callAction: function(name, options={}) {
    return (event) => {
      event.preventDefault();
      if (!options.confirm || confirm("Are you sure?")) {
        ArticleActions[name](this.props);
      }
    };
  },

  _formattedAddedOn: function() {
    return new Date(this.props.added_on).toLocaleString();
  },

  render: function() {
    return (
      <div className="ArticleEntry row">
        <h4 className="ArticleEntry__h4 col-md-12">
          <a href={this.props.url} onClick={this.callAction("open")}>
            {this.props.title}
          </a>
          <sup>{this.props.unread ? "unread" : ""}</sup>
        </h4>
        <p className="ArticleEntry__info col-md-8">
          {`Added by ${this.props.added_by} on ${this._formattedAddedOn()}`}
        </p>
        <div className="ArticleEntry__actions col-md-4 text-right"
             role="group" aria-label="Actions">
          <div className="btn-group">
            <ArchiveButton onClick={this.callAction("archive")} />
            <MarkAsReadButton id={this.props.id} unread={this.props.unread} />
            <EditButton onClick={this.callAction("edit")} />
            <DeleteButton onClick={this.callAction("delete", {confirm: true})} />
          </div>
        </div>
      </div>
    );
  }
});
