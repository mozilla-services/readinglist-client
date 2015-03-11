"use strict";

import { waterfall } from "./utils";

export default class {
  constructor(local, api, options={}) {
    this.local = local;
    this.api = api;
    this.batch = this.api.createBatch();
    this.navigator = options.navigator || navigator;
  }

  get online() {
    return this.navigator.onLine;
  }

  get remote() {
    return this.online ? this.api : this.batch;
  }

  _handleError(err) {
    console.error(err);
    throw err;
  }

  createArticle(article) {
    return waterfall([
      this.remote.createArticle.bind(this.remote),
      this.local.createArticle.bind(this.local)
    ], article).catch(this._handleError);
  }
}
