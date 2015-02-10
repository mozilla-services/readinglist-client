"use strict";

export default class Batch {
  /**
   * Constructor.
   * @param  {API}    api      The api client.
   * @param  {Object} defaults Batch defaults.
   * @return {Batch}
   */
  constructor(api, defaults={}) {
    // XXX investigate why instanceof API is broken here
    if (typeof api !== "object") {
      throw new Error("Invalid API instance.");
    }
    this.api = api;
    this.defaults = Object.assign({
      // XXX do we actually need any "default defaults" here?
    }, defaults);
    this.requests = [];
  }

  /**
   * Enqueue one or more article creation requests.
   * @param  {...Object} entities Article entities.
   * @return {Batch}
   */
  createArticle(...entities) {
    this.requests = this.requests.concat(...entities.map(function(entity) {
      // XXX could we factorize request definition with API methods? how?
      return {
        method: "POST",
        // XXX repeating prefix for now to avoid 307
        // https://github.com/mozilla-services/readinglist/issues/113
        path: "/v0/articles",
        body: entity
      };
    }));
    return this;
  }

  /**
   * Generates a JSON representation of current batch query.
   * @return {Object}
   */
  toQuery() {
    return {
      defaults: this.defaults,
      requests: this.requests
    };
  }

  /**
   * Processes all enqueued requests.
   * @return {Promise}
   */
  process() {
    return this.api.batch(this.toQuery());
  }
}
