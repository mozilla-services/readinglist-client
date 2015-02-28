"use strict";

import React from "react/addons";
import { ArticleActions } from "../flux";

import Button from "./Button";
import Panel from "./Panel";

var CloseButton = React.createClass({
  handleClick: function() {
    ArticleActions.cancelEdit();
  },

  render: function() {
    return (
      <Button type="default" size="xs" icon="remove" title="Close this form"
              onClick={this.handleClick} />
    );
  }
});

export default React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {title: "", url: ""};
  },

  componentWillReceiveProps: function(nextProps) {
    var current = nextProps.current || this.getInitialState();
    this.setState({title: current.title, url: current.url});
  },

  handleSubmit: function(event) {
    event.preventDefault();
    var params = Object.assign({
      id: this.props.current && this.props.current.id
    }, {
      title: this.state.title,
      url: this.state.url,
      added_by: "niko" // XXX fixme
    });
    if (this.props.current) {
      ArticleActions.update(params);
    } else {
      ArticleActions.create(params);
    }
    this.setState(this.getInitialState());
  },

  _getVerb: function() {
    return this.props.current ? "Update" : "Add";
  },

  render: function() {
    if (!this.props.show) {
      return null;
    }
    return (
      <Panel title={`${this._getVerb()} an article`} actionButtons={[<CloseButton />]}>
        <form method="post" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input className="form-control" type="text"
                    placeholder="Title" valueLink={this.linkState("title")}/>
          </div>
          <div className="form-group">
            <input className="form-control" type="url"
                    placeholder="http://" valueLink={this.linkState("url")}
                    disabled={!!this.props.current} />
          </div>
          <Button type="default" label={this._getVerb()} />
        </form>
      </Panel>
    );
  }
});
