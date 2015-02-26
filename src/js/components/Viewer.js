"use strict";

import React from "react/addons";
import { addons as ReactAddons } from "react/addons";

import { ArticleActions } from "../flux";

import Button from "./Button";
import Panel from "./Panel";

var CloseButton = React.createClass({
  render: function() {
    return (
      <Button type="default" size="xs" icon="remove" title="Close"
              className="btn-close" onClick={this.props.onClick} />
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

/**
 * Article viewer component.
 */
export default React.createClass({
  mixins: [ReactAddons.PureRenderMixin],

  getInitialState: function() {
    return {title: null, url: null, contents: null};
  },

  getDefaultProps: function() {
    return {contents: "Loading…"};
  },

  handleCloseClick: function() {
    ArticleActions.close();
  },

  handleMarkAsReadClick: function() {
    ArticleActions.markAsRead({id: this.props.id});
  },

  _loadFromProps: function(props) {
    this.setState({
      title: props.title,
      url: props.url,
      contents: props.contents
    });
  },

  componentDidMount: function() {
    this._loadFromProps(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    this._loadFromProps(nextProps);
  },

  render: function() {
    return (
      <Panel title={this.props.title} actionButtons={[
        <MarkAsReadButton onClick={this.handleMarkAsReadClick} />,
        <CloseButton onClick={this.handleCloseClick} />
      ]}>
        {!this.state.contents ? null :
          <div dangerouslySetInnerHTML={{__html: this.state.contents}} />}
      </Panel>
    );
  }
});
