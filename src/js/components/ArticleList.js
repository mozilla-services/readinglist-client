"use strict";

import React from "react/addons";
import { addons as ReactAddons } from "react/addons";

import { ArticleActions } from "../flux";

import ArticleEntry from "./ArticleEntry";
import Button from "./Button";
import Panel from "./Panel";

var EmptyListInfo = React.createClass({
  mixins: [ReactAddons.PureRenderMixin],

  handleImportSampleClick: function() {
    ArticleActions.import();
  },

  render: function() {
    return (
      <div className="list-empty text-center">
        <p>
          You don't have anything to read just yet.
        </p>
        <p>
          <Button type="info" label="Import sample articles"
                  onClick={this.handleImportSampleClick} />
        </p>
      </div>
    );
  }
});

export default React.createClass({
  mixins: [ReactAddons.PureRenderMixin],

  render: function() {
    return (
      <Panel title="Articles" bodyWrap={false}>
        <ul className="list-group">{
          this.props.articles.map(function(article) {
            return (
              <li key={article.id} className="list-group-item">
                <ArticleEntry article={article} />
              </li>
            );
          })
        }</ul>
        {!this.props.articles.length ? <EmptyListInfo/> : null}
      </Panel>
    );
  }
});
