"use strict";

import { waterfall } from "./utils";

export default class {
  constructor(db, api, options={}) {
    this.db = db;
    this.api = api;
    this.navigator = options.navigator || navigator;
  }

  online() {
    return this.navigator.onLine;
  }

  createArticle(article) {
    if (!this.online) {
      return this.batch.createArticle(article);
    }
    return waterfall([
      this.api.createArticle.bind(this.api),
      this.db.createArticle.bind(this.db)
    ], article);
  }
}
