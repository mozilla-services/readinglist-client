"use strict";

import React from "react/addons";

import ArticleEntry from "./ArticleEntry";
import Panel from "./Panel";

export default React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    // XXX this is odd.
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  },

  renderEmptyListMessage: function() {
    if (this.props.articles.length > 0) return;
    return (
      <p className="list-group-item">
        You don't have anything to read just yet.
      </p>
    );
  },

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
        {this.renderEmptyListMessage()}
      </Panel>
    );
  }
});
