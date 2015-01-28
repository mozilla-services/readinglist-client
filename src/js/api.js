"use strict";

var rest = require("rest");
var pathPrefix = require("rest/interceptor/pathPrefix");
var mime = require("rest/interceptor/mime");
var errorCode = require("rest/interceptor/errorCode");
var defaultRequest = require("rest/interceptor/defaultRequest");
var hateoas = require("rest/interceptor/hateoas");

class API {
  constructor(baseUrl, options={}) {
    this.baseUrl = baseUrl;
    this.client = options.client || rest
      .wrap(pathPrefix, {prefix: this.baseUrl})
      .wrap(errorCode, {code: 400})
      .wrap(defaultRequest, {headers: {"X-Requested-With": "readinglist-client"}})
      .wrap(mime, {mime: "application/json;encoding=UTF-8"})
      .wrap(hateoas);
  }

  /**
   * Wrap a request promise to add generic error handling.
   * @param  {Promise} promise The original request promise.
   * @return {Promise}         The wrapped promise.
   */
  _wrap(promise) {
    return promise.catch(function(res) {
      // Only expose the error entity object, in the following form:
      // {"errno":104,
      //  "message":"Please authenticate yourself to use this endpoint.",
      //  "code":401,
      //  "error":"Unauthorized"}
      throw res.entity;
    });
    //.done(function(res) {
    //   return res.entity;
    // })
  }

  /**
   * GET /hello
   * @return {Promise}
   */
  hello() {
    return this._wrap(this.client({path: "/"}));
  }

  /**
   * GET /fxa-oauth/login
   * @return {Promise}
   */
  signinToFxA() {
    this._wrap(this.client({path: "/fxa-oauth/login"}));
  }

  /**
   * POST /articles
   * @return {Promise}
   */
  createArticle(fields) {
    return this._wrap(this.client({
      method: "POST",
      path: "/articles",
      entity: JSON.stringify(fields)
    }));
  }

  /**
   * GET /articles
   * @param  {Object} options Request params.
   * @return {Promise}
   */
  listArticles(params={}) {
    return this._wrap(this.client({path: "/articles"}));
  }

  /**
   * GET /articles/<id>
   * @param  {Object} params Request params.
   * @return {Promise}
   */
  getArticle(params={}) {
    return this._wrap(this.client({path: `/article${params.id}`}));
  }

  /**
   * DELETE /articles/<id>
   * @param  {Object} params Request params.
   * @return {Promise}
   */
  deleteArticle(params={}) {
    return this._wrap(this.client({
      method: "DELETE",
      path: `/article/${params.id}`
    }));
  }
}

module.exports = API;
