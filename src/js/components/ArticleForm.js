"use strict";

import React from "react/addons";
import { ArticleActions } from "../flux";

import Panel from "./Panel";

export default React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {title: "", url: ""};
  },

  handleSubmit: function(event) {
    event.preventDefault();
    ArticleActions.create({
      title: this.state.title,
      url: this.state.url,
      added_by: "niko" // XXX fixme
    });
    this.setState(this.getInitialState());
  },

  render: function() {
    return (
      <Panel title="Add an article">
        <form method="post" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input className="form-control" type="text"
                    placeholder="Title" valueLink={this.linkState("title")}/>
          </div>
          <div className="form-group">
            <input className="form-control" type="url"
                    placeholder="http://" valueLink={this.linkState("url")}/>
          </div>
          <button className="btn btn-default">Add</button>
        </form>
      </Panel>
    );
  }
});
