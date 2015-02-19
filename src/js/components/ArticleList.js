"use strict";

import React from "react/addons";
import { addons as ReactAddons } from "react/addons";

import { ArticleActions } from "../flux";

import ArticleEntry from "./ArticleEntry";
import Button from "./Button";
import Panel from "./Panel";

var AddButton = React.createClass({
  handleAddClick: function() {
    ArticleActions.add();
  },

  render: function() {
    return (
      <Button className="btn-add" type="default" title="Add an article"
              size="xs" icon="plus" onClick={this.handleAddClick} />
    );
  }
});

var ImportButton = React.createClass({
  handleImportSampleClick: function() {
    ArticleActions.import();
  },

  render: function() {
    return (
      <Button className="btn-import" type="info" title="Import sample articles"
              size="xs" icon="download-alt" onClick={this.handleImportSampleClick} />
    );
  }
});

var NextPageButton = React.createClass({
  handleNextClick: function() {
    ArticleActions.listNext();
  },

  render: function() {
    return (
      <Button type="info" size="sm" icon="chevron-right"
              onClick={this.handleNextClick} label="Next" />
    );
  }
});

export default React.createClass({
  mixins: [ReactAddons.PureRenderMixin],

  render: function() {
    var actionButtons = [<AddButton/>];
    if (!this.props.articles.length) {
      actionButtons.push(<ImportButton/>);
    }
    return (
      <Panel title="Articles" bodyWrap={false} actionButtons={actionButtons}>
        <ul className="list-group">{
          this.props.articles.map(article => {
            var classes = ReactAddons.classSet({
              "list-group-item": true,
              "active": article.id === this.props.selectedId
            });
            return (
              <li key={article.id} className={classes}>
                <ArticleEntry {...article} />
              </li>
            );
          })
        }</ul>
        {!this.props.hasNext ? null :
          <p className="list-pages text-right">
            <NextPageButton />
          </p>}
        {this.props.articles.length ? null :
          <p className="list-empty text-center">
            You don't have anything to read just yet.
          </p>}
      </Panel>
    );
  }
});
