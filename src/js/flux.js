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

  initialize: function(api, options={debug: false}) {
    this.api = api;
    this.debug = !!options.debug;
    if (this.debug) {
      this.subscribe(function(state) {
        console.info("AuthStore state changed", state);
      });
    }
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
  "add",
  "create",
  "edit",
  "cancelEdit",
  "get",
  "update",
  "delete",
  "list",
  "listNext",
  "import",
  "open",
  "close",
  "markAsRead"
]);

export var ArticleStore = DocBrown.createStore({
  actions: [ArticleActions],

  /**
   * Constructor.
   * @param  {API}            api            The API client instance.
   * @param  {ContentManager} contentManager The content manager instance.
   * @param  {Object}         options        The options object.
   * @return {ArticleStore}
   */
  initialize: function(api, contentManager, options={debug: false}) {
    this.api = api;
    this.contentManager = contentManager;
    this.debug = !!options.debug;
    if (this.debug) {
      this.subscribe(function(state) {
        console.info("ArticleStore state changed", state);
      });
    }
  },

  getInitialState: function() {
    return {
      articles: [],
      current: null,
      currentContents: null,
      edit: false,
      error: null,
      errorType: null,
      hasNext: false,
      totalRecords: 0,
    };
  },

  updateArticleList: function(articles) {
    this.setState({
      articles: articles,
      hasNext: this.api.hasNext(),
      totalRecords: this.api.totalRecords,
    });
  },

  resetError: function() {
    this.setState({error: null, errType: null});
  },

  setError: function(error, type=null) {
    this.setState({error: error, errType: type});
  },

  add: function() {
    this.setState({edit: true, current: null});
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

  edit: function(article) {
    this.setState({edit: true, current: article});
  },

  cancelEdit: function() {
    this.setState({edit: false});
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

  update: function(params) {
    this.setState({edit: false});
    this.resetError();
    return this.api.updateArticle(params);
  },

  updateError: function(err) {
    this.setError(err, "update");
  },

  updateSuccess: function(article) {
    this.setState({edit: false, current: article});
    ArticleActions.list();
  },

  delete: function(article) {
    this.resetError();
    return this.api.deleteArticle(article);
  },

  deleteSuccess: function(article) {
    var current = this.state.current || {};
    if (current.id === article.id) {
      this.setState({current: null, edit: false});
    }
    this.contentManager.drop(article);
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
    this.updateArticleList(articles);
  },

  listError: function(err) {
    this.setError(err, "list");
  },

  listNext: function() {
    this.resetError();
    return this.api.listNext();
  },

  listNextSuccess: function(articles) {
    this.updateArticleList(articles);
  },

  listNextError: function(err) {
    this.setError(err, "listNext");
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
    response.responses.forEach(response => {
      if (this.debug) {
        console.log("imported", response.body.title, "HTTP", response.status);
      }
    });
    ArticleActions.list();
  },

  importError: function(err) {
    this.setError(err, "import");
  },

  open: function(article) {
    this.setState({edit: false, current: article});
    return this.contentManager.load(article);
  },

  openSuccess: function(articleContents) {
    this.setState({currentContents: articleContents});
  },

  openError: function(err) {
    this.setError(err, "open");
  },

  close: function() {
    this.setState({current: null, currentContents: null});
  },

  markAsRead: function(article) {
    // XXX todo
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
