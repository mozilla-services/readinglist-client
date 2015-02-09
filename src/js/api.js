"use strict";

import rest from "rest";
import pathPrefix from "rest/interceptor/pathPrefix";
import mime from "rest/interceptor/mime";
import errorCode from "rest/interceptor/errorCode";
import defaultRequest from "rest/interceptor/defaultRequest";
import hateoas from "rest/interceptor/hateoas";
import basicAuth from "rest/interceptor/basicAuth";

/**
 * Readinglist server REST API client.
 * https://github.com/mozilla-services/readinglist/wiki/API-Design-proposal
 */
export default class API {
  constructor(baseUrl, options={}) {
    this.baseUrl = baseUrl;
    this.client = options.client || this.createClient();
  }

  /**
   * Wrap a request promise to add generic error handling.
   * @param  {Promise} promise The original request promise.
   * @return {Promise}         The wrapped promise.
   */
  _wrap(promise) {
    return promise.catch(res => {
      if (!res.entity || res.error === "loaderror") {
        throw new Error("Server seems to be down");
      }
      // res.entity is in the following form:
      // {"errno":104,
      //  "message":"Please authenticate yourself to use this endpoint.",
      //  "code":401,
      //  "error":"Unauthorized"}
      throw Object.assign(new Error(), res.entity);
    }).then(res => {
      // Get rid of the .entity intermediate property.
      return res.entity;
    });
  }

  createClient() {
    return rest
      .wrap(pathPrefix, {prefix: this.baseUrl})
      .wrap(errorCode, {code: 400})
      .wrap(defaultRequest, {headers: {"Requested-With": "readinglist-client"}})
      .wrap(mime, {mime: "application/json;encoding=UTF-8"})
      .wrap(hateoas)
      // XXX fix this
      .wrap(basicAuth, {username: "niko", password: "niko"});
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
    return this._wrap(this.client({method: "POST", path: "/articles", entity: fields}));
  }

  /**
   * GET /articles
   * @param  {Object} options Request params.
   * @return {Promise}
   */
  listArticles(params={}) {
    var q = {
      unread:   true,
      _sort: "-last_modified"
    };
    return this._wrap(this.client({
      path: "/articles",
      params: q
    })).then(res => res.items);
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
      path: `/articles/${params.id}`
    }));
  }
}
