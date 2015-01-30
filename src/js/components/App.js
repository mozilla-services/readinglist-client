"use strict";

// Load 6to5 polyfills http://6to5.org/docs/usage/polyfill/
import "6to5/polyfill";

import React from "react/addons";
import DocBrown from "docbrown";
import { ArticleActions, stores } from "../flux";

import Alert from "./Alert";
import ArticleForm from "./ArticleForm";
import ArticleList from "./ArticleList";

export default React.createClass({
  mixins: [DocBrown.storeMixin(stores.getter("articleStore"))],

  componentDidMount: function() {
    ArticleActions.list();
  },

  renderError: function() {
    if (!this.state.error) return;
    return (
      <Alert title="Error">
        <p>{this.state.error.message}</p>
      </Alert>
    );
  },

  render: function() {
    return (
      <div className="container-fluid">
        <h1>Readinglist</h1>
        {this.renderError()}
        <div className="row">
          <div className="col-md-3">
            <ArticleList articles={this.state.articles} />
          </div>
          <div className="col-md-9">
            <ArticleForm />
          </div>
        </div>
      </div>
    );
  }
});
