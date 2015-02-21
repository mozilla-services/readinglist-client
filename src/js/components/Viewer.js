"use strict";

import React from "react/addons";
import { addons as ReactAddons } from "react/addons";

import { ArticleActions } from "../flux";

import Button from "./Button";
import Panel from "./Panel";

var CloseButton = React.createClass({
  handleClick: function() {
    ArticleActions.close();
  },

  render: function() {
    return (
      <Button type="default" size="xs" icon="remove" title="Close"
              className="btn-close" onClick={this.handleClick} />
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
      <Panel title={this.props.title} actionButtons={[<CloseButton />]}>
        {!this.state.contents ? null :
          <div dangerouslySetInnerHTML={{__html: this.state.contents}} />}
      </Panel>
    );
  }
});
