"use strict";

import React from "react/addons";
import { addons as ReactAddons } from "react/addons";

import { ArticleActions } from "../flux";
import { ArticleConstants } from "../api";

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

var PanelTitle = React.createClass({
  render: function() {
    return (
      <span>
        Articles
        {!this.props.totalRecords ? null :
          <span className="badge">{this.props.totalRecords}</span>}
      </span>
    );
  }
});

var FilterToggler = React.createClass({
  render: function() {
    return (
      <div className="btn-group" role="group">{
        this.props.choices.map((choice, i) => {
          return <Button key={i} label={choice.label} size="sm"
                         type={this.props.valueCheck === choice.value ? "info" : "default"}
                         onClick={this.props.changeHandler(choice.value)} />;
        })
      }</div>
    );
  }
});

var Filters = React.createClass({
  statics: {
    unreadChoices: [
      {label: "Read",   value: false},
      {label: "Unread", value: true}
    ],
    statusChoices: [
      {label: "Default",  value: ArticleConstants.status.DEFAULT},
      {label: "Archived", value: ArticleConstants.status.ARCHIVED},
      {label: "Deleted",  value: ArticleConstants.status.DELETED},
    ]
  },

  filterClickHandler: function(name) {
    return function(value) {
      return () => ArticleActions.list({[name]: value});
    };
  },

  render: function() {
    return (
      <div className="list-filters">
        <div className="col-xs-6 text-left">
          <FilterToggler choices={Filters.unreadChoices}
                         valueCheck={this.props.filters.unread}
                         changeHandler={this.filterClickHandler("unread")} />
        </div>
        <div className="col-xs-6 text-right">
          <FilterToggler choices={Filters.statusChoices}
                         valueCheck={this.props.filters.status}
                         changeHandler={this.filterClickHandler("status")} />
        </div>
      </div>
    );
  }
});

export default React.createClass({
  mixins: [ReactAddons.PureRenderMixin],

  getDefaultProps: function() {
    return {filters: {}};
  },

  render: function() {
    var actionButtons = [<AddButton/>];
    if (!this.props.articles.length) {
      actionButtons.push(<ImportButton/>);
    }
    return (
      <Panel title={<PanelTitle totalRecords={this.props.totalRecords} />}
             bodyWrap={false} actionButtons={actionButtons}>
        <div className="panel-body">
          <Filters filters={this.props.filters} />
        </div>
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
          <p className="list-empty text-center">The list is empty.</p>}
      </Panel>
    );
  }
});
