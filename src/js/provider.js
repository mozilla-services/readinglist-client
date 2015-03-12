"use strict";

import { waterfall } from "./utils";

export default class {
  constructor(local, api, options={}) {
    this.local = local;
    this.api = api;
    this.batch = this.api.createBatch();
    this.navigator = options.navigator || navigator;
    this.debug = !!options.debug;
  }

  get online() {
    return this.navigator.onLine;
  }

  get remote() {
    return this.online ? this.api : this.batch;
  }

  _handleError(err) {
    if (this.debug) {
      console.error("Provider error", err.message);
    }
    throw err;
  }

  process(method, article) {
    return waterfall([
      this.remote[method].bind(this.remote),
      this.local[method].bind(this.local)
    ], article).catch(this._handleError.bind(this));
  }

  createArticle(article) {
    return this.process("createArticle", article);
  }

  updateArticle(article) {
    return this.process("updateArticle", article);
  }

  deleteArticle(article) {
    return this.process("deleteArticle", article);
  }
}
