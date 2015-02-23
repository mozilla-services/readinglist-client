"use strict";

import rest from "rest";
import mime from "rest/interceptor/mime";
import errorCode from "rest/interceptor/errorCode";

export const DEFAULT_STORAGE_KEY_PREFIX = "readinglist:article:";

/**
 * Article content storage; fetches and stores readable article contents
 * locally, through the readable-proxy server API.
 *
 * @link https://github.com/n1k0/readable-proxy/
 */
export default class ContentManager {
  constructor(proxyServerUrl, options={debug: false}) {
    this.proxyServerUrl = proxyServerUrl;
    this.client = options.client || this.createClient();
    this.storage = options.storage || localStorage;
    this.keyPrefix = options.keyPrefix || DEFAULT_STORAGE_KEY_PREFIX;
    this.debug = !!options.debug;
  }

  createClient() {
    return rest
      .wrap(mime, {mime: "application/json;encoding=UTF-8"})
      .wrap(errorCode, {code: 400});
  }

  /**
   * Fetches article contents remotely. Uses a web proxy.
   *
   * @param  {Object} article
   * @return {Promise}
   */
  fetch(article) {
    return this.client({
      path: this.proxyServerUrl,
      params: {
        url: article.url,
        sanitize: "yes"
      }
    }).then(res => {
      var contents = res && res.entity && res.entity.content;
      this.save(article, contents);
      return contents;
    }).catch(res => {
      if (this.debug) {
        console.error("fetch() request error: ", res);
      }
      throw new Error(`Unable to fetch contents for ${article.title}`);
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
