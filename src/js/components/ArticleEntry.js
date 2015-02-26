"use strict";

import React from "react/addons";
import { ArticleActions } from "../flux";
import { addons as ReactAddons } from "react/addons";

import Button from "./Button";

var EditButton = React.createClass({
  render: function() {
    return (
      <Button className="btn-edit" type="default" size="xs" title="Edit"
              onClick={this.props.onClick} icon="pencil" />
    );
  }
});

var DeleteButton = React.createClass({
  render: function() {
    return (
      <Button className="btn-delete" type="danger" size="xs" icon="trash"
              title="Delete" onClick={this.props.onClick} disabled={this.props.checked} />
    );
  }
});

var MarkAsReadButton = React.createClass({
  render: function() {
    return (
      <Button className="btn-mark-as-read" type="default" title="Mark as read"
              size="xs" icon="ok" onClick={this.props.onClick} />
    );
  }
});

var ArchiveButton = React.createClass({
  render: function() {
    return (
      <Button className="btn-archive" type="default" title="Archive"
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
        <p className="ArticleEntry__info col-md-9">
          {`Added by ${this.props.added_by} on ${this._formattedAddedOn()}`}
        </p>
        <div className="ArticleEntry__actions col-md-3 text-right"
             role="group" aria-label="Actions">
          <div className="btn-group">
            <ArchiveButton onClick={this.callAction("archive")} />
            <MarkAsReadButton onClick={this.callAction("markAsRead")} />
            <EditButton onClick={this.callAction("edit")} />
            <DeleteButton onClick={this.callAction("delete", {confirm: true})} />
          </div>
        </div>
      </div>
    );
  }
});
