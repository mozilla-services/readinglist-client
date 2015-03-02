"use strict";

import localforage from "localforage";
import EventEmitter from "events";

export default class Local extends EventEmitter {
  constructor(options={}) {
    this.storage = options.storage || this.createStorage(options.storageConfig);
    this.debug = Boolean(options.debug);
  }

  createStorage(options={}) {
    localforage.config(Object.assign({
      name:      "readinglist-client",
      storeName: "articles",
      version:   "1.0"
    }, options));
    return localforage;
  }

  initDB() {

  }

  _setArticle(article) {
    var key = `article:id=${article.id}`;
    return this.storage.setItem(key, article).catch(err => {
      this.emit("error", err);
    });
  }

  createArticle(article) {
    //this._queue.push({name: "createArticle", args: arguments});
    return this._setArticle(article).then(() => {
      this.emit("created", article);
      return article;
    });
  }

  listArticles(filters={}) {
    var articles = [];
    return this.storage.iterate(article => {
      // XXX process filters
      articles.push(article);
    }).then(() => articles);
  }

  getArticle(params={}) {
    var key = `article:id=${params.id}`;
    return this.storage.getItem(key);
  }

  updateArticle(article) {
    return this._setArticle(article).then(() => {
      this.emit("updated", article);
    });
  }

  deleteArticle(article) {
    var key = `article:id=${article.id}`;
    return this.storage.removeItem(key).then(() => {
      this.emit("deleted", key, article);
    }).catch(err => {
      this.emit("error", err);
    });
  }
}
