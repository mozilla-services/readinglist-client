"use strict";

export default class {
  constructor(db, api) {
    this.db = db;
    this.api = api;
  }

  createArticle(article) {
    // XXX start local db transaction
    return Promise.all([
      this.db.createArticle(article),
      this.api.createArticle(article) // XXX check for online status
                                      // if online, perform request
                                      // if offline, add batch
    ]).catch(err => {
      // XXX rollback local db transaction
      throw err;
    });
  }
}
