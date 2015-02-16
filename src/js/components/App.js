"use strict";

// Load 6to5 polyfills http://6to5.org/docs/usage/polyfill/
import "6to5/polyfill";

import React from "react/addons";
import DocBrown from "docbrown";
import { ArticleActions, stores } from "../flux";

import Alert from "./Alert";
import ArticleForm from "./ArticleForm";
import ArticleList from "./ArticleList";
import Auth from "./Auth";
import Viewer from "./Viewer";

export default React.createClass({
  mixins: [DocBrown.storeMixin(stores.getter("articleStore"))],

  componentDidMount: function() {
    ArticleActions.list();
  },

  renderError: function() {
    // XXX we'd rather want a notification list here.
    if (this.state.error)
      return <Alert>{this.state.error.message}</Alert>;
  },

  render: function() {
    return (
      <div className="container-fluid">
        <h1>Readinglist</h1>
        {this.renderError()}
        <div className="row">
          <div className="col-md-3">
            <Auth />
            <ArticleList articles={this.state.articles} />
          </div>
          <div className="col-md-9">
            <ArticleForm show={this.state.edit} current={this.state.current} />
            {this.state.current ? <Viewer {...this.state.current} /> : null}
          </div>
        </div>
      </div>
    );
  }
});
