"use strict";

import Dexie from "dexie";
import localforage from "localforage";
import EventEmitter from "events";

export default class Local extends EventEmitter {
  constructor(options={}) {
    this.debug = Boolean(options.debug);
    this.db = this.createDB();
  }

  createDB() {
    var db = new Dexie("readinglist");
    db.on("error", function(err) {
      console.log("error", err);
    });
    db.version(1).stores({
      articles: [
        "id", "last_modified", "url", "title", "resolved_url", "resolved_title",
        "excerpt", "archived", "favorite", "is_article", "word_count", "unread",
        "added_by", "added_on", "stored_on", "marked_read_by", "marked_read_on",
        "read_position"
      ].join(",")
    });
    db.open();
    return db;
  }

  drop() {
    this.db.close();
    return this.db.delete();
  }

  createArticle(article) {
    return this.db.articles.add(article).then(() => article);
  }

  listArticles(filters={}) {
    return this.db.articles.toArray();
  }
}
