"use strict";

import React from "react/addons";

import ArticleEntry from "./ArticleEntry";
import Panel from "./Panel";

export default React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    // XXX this is odd.
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  },

  render: function() {
    return (
      <Panel title="Articles" bodyWrap={false}>
        <ul className="list-group">{
          this.props.articles.map(function(article, i) {
            return (
              <li key={i} className="list-group-item">
                <ArticleEntry article={article} />
              </li>
            );
          })
        }</ul>
        {this.props.articles.length === 0 ?
          <p className="list-group-item">Your list is empty.</p> : null}
      </Panel>
    );
  }
});
