"use strict";

import React from "react/addons";
import { addons as ReactAddons } from "react/addons";

import { ArticleActions } from "../flux";

import Button from "./Button";
import Panel from "./Panel";

export const DEFAULT_IFRAME_SRC_URL = "about:blank";

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
 *
 * XXX For now this only tries to load the article url in a local iframe.
 * In a near future, we'll rather display the readable article HTML contents
 * fetched from the service.
 */
export default React.createClass({
  mixins: [ReactAddons.PureRenderMixin],

  getDefaultProps: function() {
    return {url: DEFAULT_IFRAME_SRC_URL};
  },

  getInitialState: function() {
    return {url: this.props.url};
  },

  _loadFromProps: function(props) {
    this.setState({url: props && props.url || DEFAULT_IFRAME_SRC_URL});
  },

  componentDidMount: function() {
    this._loadFromProps(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    this._loadFromProps(nextProps);
  },

  render: function() {
    return (
      <Panel title={this.props.title} bodyWrap={false} actionButtons={[<CloseButton />]}>
        <iframe src={this.props.url} />
      </Panel>
    );
  }
});
