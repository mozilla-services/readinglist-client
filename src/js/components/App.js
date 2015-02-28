"use strict";

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
    if (this.state.error) {
      return <Alert>{this.state.error.message}</Alert>;
    }
  },

  render: function() {
    return (
      <div className="container-fluid">
        <h1><a href="./">Readinglist</a></h1>
        {this.renderError()}
        <div className="row">
          <div className="col-sm-4">
            <Auth />
            <ArticleList articles={this.state.articles}
                         filters={this.state.filters}
                         selectedId={this.state.current && this.state.current.id}
                         hasNext={this.state.hasNext}
                         totalRecords={this.state.totalRecords} />
          </div>
          <div className="col-sm-8">
            <ArticleForm show={this.state.edit} current={this.state.current} />
            {this.state.current ?
              <Viewer contents={this.state.currentContents}
                      {...this.state.current} /> : null}
          </div>
        </div>
      </div>
    );
  }
});
