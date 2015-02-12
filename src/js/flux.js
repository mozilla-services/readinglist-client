"use strict";

import DocBrown from "docbrown";
import sampleArticles from "../data/samples.json";

export var Dispatcher = DocBrown.createDispatcher();

export var AuthActions = DocBrown.createActions(Dispatcher, [
  "signin",
  "signout",
  "checkAuth"
]);

export var AuthStore = DocBrown.createStore({
  actions: [AuthActions],

  initialize: function(api) {
    this.api = api;
  },

  getInitialState: function() {
    return {authToken: null};
  },

  signin: function() {
    this.api.signinToFxA();
  },

  checkAuth: function() {
    this.setState({authToken: this.api.checkAuth()});
  },

  signout: function() {
    this.api.signout();
    this.setState(this.getInitialState());
  }
});

export var ArticleActions = DocBrown.createActions(Dispatcher, [
  "create",
  "get",
  "edit",
  "update",
  "delete",
  "list",
  "import"
]);

export var ArticleStore = DocBrown.createStore({
  actions: [ArticleActions],

  initialize: function(api) {
    this.api = api;
  },

  getInitialState: function() {
    return {
      articles: [],
      current: null,
      error: null,
      errorType: null
    };
  },

  resetError: function() {
    this.setState({error: null, errType: null});
  },

  setError: function(error, type=null) {
    this.setState({error: error, errType: type});
  },

  create: function(params) {
    this.resetError();
    return this.api.createArticle(params);
  },

  createSuccess: function(article) {
    ArticleActions.list();
  },

  createError: function(err) {
    this.setError(err, "create");
  },

  get: function(params) {
    this.resetError();
    return this.api.getArticle(params);
  },

  getSuccess: function(article) {
    this.setState({current: article});
  },

  getError: function(err) {
    this.setError(err, "get");
  },

  edit: function(params) {
    ArticleActions.get(params);
  },

  update: function(params) {
    this.resetError();
    return this.api.updateArticle(params);
  },

  updateError: function(err) {
    this.setError(err, "update");
  },

  updateSuccess: function(article) {
    this.setState({current: article});
    ArticleActions.list();
  },

  delete: function(article) {
    this.resetError();
    return this.api.deleteArticle(article);
  },

  deleteSuccess: function(article) {
    var current = this.state.current || {};
    if (current.id === article.id) this.setState({current: null});
    ArticleActions.list();
  },

  deleteError: function(err) {
    this.setError(err, "delete");
  },

  list: function(params) {
    this.resetError();
    return this.api.listArticles(params);
  },

  listSuccess: function(articles) {
    this.setState({articles: articles});
  },

  listError: function(err) {
    this.setError(err, "list");
  },

  import: function() {
    this.resetError();
    // We use the batch API mostly for testing purpose; we could simply append
    // sample articles to the current list instead :)
    var batch = this.api.createBatch();
    return batch.createArticle.apply(batch, sampleArticles).process();
  },

  importSuccess: function(response) {
    // XXX We want proper notification messages displayed to the end user here
    response.responses.forEach(function(response) {
      console.log("imported", response.body.title, "HTTP", response.status);
    });
    ArticleActions.list();
  },

  importError: function(err) {
    this.setError(err, "import");
  }
});

function StoreRegistry() {
  var _stores = {};
  return {
    clear: function() {
      _stores = {};
    },
    register: function(stores) {
      for (var name in stores) {
        if (this.has(name))
          throw new Error(`Store ${name} is already registered.`);
        _stores[name] = stores[name];
      }
    },
    has: function(name) {
      return _stores.hasOwnProperty(name);
    },
    get: function(name) {
      if (this.has(name)) return _stores[name];
      throw new Error(`No '${name}' store registered.`);
    },
    getter: function(name) {
      return () => this.get(name);
    }
  };
}

export var stores = new StoreRegistry();
