"use strict";

import Dexie from "dexie";
import EventEmitter from "events";
import { fromIDBObj, toIDBObj } from "./utils";

const articleFields = [
  "id", "last_modified", "url", "title", "resolved_url", "resolved_title",
  "excerpt", "archived", "favorite", "is_article", "word_count", "unread",
  "added_by", "added_on", "stored_on", "marked_read_by", "marked_read_on",
  "read_position"
];
const booleanFields = ["archived", "favorite", "is_article", "unread"];

export default class Local extends EventEmitter {
  constructor(options={}) {
    this.debug = Boolean(options.debug);
    this.db = this.createDB();
  }

  createDB() {
    var db = new Dexie("readinglist");
    db.on("error", function(err) {
      console.log("error", err.message);
    });
    db.version(1).stores({articles: articleFields.join(",")});
    db.open();
    return db;
  }

  drop() {
    this.db.close();
    return this.db.delete();
  }

  getArticle(params) {
    return this.db.articles.get(params.id)
               .then(article => fromIDBObj(article, booleanFields));
  }

  createArticle(article) {
    return this.db.articles.add(toIDBObj(article, booleanFields))
               .then(() => article);
  }

  updateArticle(article) {
    return this.db.articles.update(article.id, toIDBObj(article, booleanFields))
               .then(() => article);
  }

  deleteArticle(article) {
    return this.db.articles.delete(article.id)
               .then(() => article);
  }

  listArticles(filters={}) {
    var table      = this.db.articles,
        idbFilters = toIDBObj(filters, booleanFields),
        whereUsed = false;
    for (var filter in idbFilters) {
      if (!whereUsed) {
        whereUsed = true;
        table = table.where(filter).equals(idbFilters[filter]);
      } else {
        /*eslint no-loop-func:0*/
        table = table.and(article => article[filter] === idbFilters[filter]);
      }
    }
    return table.toArray().then(articles => {
      return articles.map(article => fromIDBObj(article, booleanFields));
    });
  }
}
