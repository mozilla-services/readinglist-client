"use strict";

import jsonpClient from "rest/client/jsonp";

export const JSONP_PROXY_URL = "http://www.whateverorigin.org/get";
export const STORAGE_KEY_PREFIX = "readinglist:article:";

/**
 * Article content storage; fetches and stores article contents locally.
 *
 * XXX: Readability parsing.
 */
export default class ContentManager {
  constructor(options={debug: false}) {
    this.client = options.client || this.createClient();
    this.storage = options.storage || localStorage;
    this.keyPrefix = options.keyPrefix || STORAGE_KEY_PREFIX;
    this.debug = !!options.debug;
  }

  createClient() {
    return jsonpClient;
  }

  /**
   * Fetches article contents remotely. Uses a web proxy.
   *
   * XXX: Use a mozilla service?
   *
   * @param  {Object} article
   * @return {Promise}
   */
  fetch(article) {
    return this.client({
      path: JSONP_PROXY_URL,
      params: {url: article.url}
    }).then(res => {
      var contents = res && res.entity && res.entity.contents;
      this.save(article.id, contents);
      return contents;
    }).catch(err => {
      if (this.debug) {
        console.error("Unable to fetch contents for ", article.url, err);
      }
      return null;
    });
  }

  /**
   * Loads article contents asynchronously.
   * @param  {Object} article
   * @return {Promise}
   */
  load(article) {
    if (!this.has(article)) return this.fetch(article);
    return Promise.resolve(this.storage.getItem(this.keyPrefix + article.id));
  }

  /**
   * Synchronous. Checks if local storage has contents available for a given
   * article.
   * @param  {Object}  article
   * @return {Boolean}
   */
  has(article) {
    return this.storage.hasOwnProperty(this.keyPrefix + article.id);
  }

  /**
   * Synchronous. Removes saved article contents from local storage.
   * @param  {Object} article
   */
  drop(article) {
    this.storage.removeItem(this.keyPrefix + article.id);
  }

  /**
   * Synchronous. Saves article contents in local storage.
   * @param  {Object} article
   * @param  {String} contents
   */
  save(article, contents) {
    if (typeof contents === "string" && contents.length)
      this.storage.setItem(this.keyPrefix + article.id, contents);
  }
}
