"use strict";

import Batch from "./batch";

import rest from "rest";
import pathPrefix from "rest/interceptor/pathPrefix";
import mime from "rest/interceptor/mime";
import errorCode from "rest/interceptor/errorCode";
import defaultRequest from "rest/interceptor/defaultRequest";
import hateoas from "rest/interceptor/hateoas";
import interceptor from "rest/interceptor";

export const AUTH_TOKEN_KEYNAME = "readinglist:auth:token";

/**
 * FxA auth custom interceptor.
 * @link https://github.com/cujojs/rest/blob/master/docs/interceptors.md#custom-interceptors
 */
export var authInterceptor = interceptor({
  request: function (request, config, meta) {
    var headers = request.headers || (request.headers = {});
    var authToken = config.authTokenGetter();
    if (authToken) {
      headers.Authorization = "Bearer " + config.authTokenGetter();
    }
    return request;
  }
});

/**
 * Readinglist server REST API client.
 * @link http://readinglist.readthedocs.org/
 */
export default class API {
  /**
   * Constructor.
   * @constructor
   * @param  {String} baseUrl Server base URL.
   * @param  {Object} options Options.
   * @return {API}
   */
  constructor(baseUrl, options={}) {
    this.baseUrl = baseUrl;
    this.client = options.client || this.createClient();
    this.window = options.window || window;
    this._authToken = null;
  }

  /**
   * Wrap a request promise to add generic error handling.
   * @param  {Promise} promise The original request promise.
   * @return {Promise}         The wrapped promise.
   */
  _wrap(promise) {
    return promise.catch(res => {
      if (!res.entity || res.error === "loaderror") {
        throw new Error("Server is unreachable. Are you offline?");
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
      .wrap(authInterceptor, {authTokenGetter: () => this._authToken});
  }

  /**
   * GET /hello
   * @return {Promise}
   */
  hello() {
    return this._wrap(this.client({path: "/"}));
  }

  /**
   * Redirects the user to the FxA signin page.
   *
   * Note: Massive side effect as this redirects the user to the FxA
   * signin/registration page; after users authenticate there, they are
   * redirected here again with a token passed as an url hash parameter.
   */
  signinToFxA() {
    var location = this.window.location;
    var redirectUrl = encodeURIComponent(
      location.protocol + "//" +
      location.hostname + ":"  +
      location.port     +
      location.pathname + "#auth:"
    );
    this.window.location = `${this.baseUrl}/fxa-oauth/login?redirect=${redirectUrl}#`;
  }

  /**
   * Checks user authentication status, sets and persist authentication token,
   * if any is found in the current page URL. Performed at application page load
   * time, once.
   */
  checkAuth() {
    // Check sessionStorage
    var authToken = this.window.sessionStorage.getItem(AUTH_TOKEN_KEYNAME);
    if (authToken) {
      return this.setAuthToken(authToken);
    }

    // Check for auth token passed as current URL hash;
    var tokenMatch = /^#auth:([a-f0-9]{64})$/.exec(this.window.location.hash);
    if (!tokenMatch) return null;

    // Clear the token from the current url.
    this.window.location.hash = "";

    return this.setAuthToken(tokenMatch[1]);
  }

  /**
   * Sets and persists auth token.
   * @param  {String} authToken The auth token.
   * @return {String}           The provided auth token, for convenience.
   */
  setAuthToken(authToken)  {
    this._authToken = authToken;
    if (typeof authToken === "string") {
      this.window.sessionStorage.setItem(AUTH_TOKEN_KEYNAME, authToken);
    } else {
      this.window.sessionStorage.removeItem(AUTH_TOKEN_KEYNAME);
    }
    return authToken;
  }

  /**
   * Signs the user out.
   */
  signout() {
    this.setAuthToken(null);
  }

  /**
   * POST /articles
   * @param {Object} entity The article entity.
   * @return {Promise}
   */
  createArticle(entity={}) {
    return this._wrap(this.client({
      method: "POST",
      path: "/articles",
      entity: entity
    }));
  }

  /**
   * GET /articles
   * @param  {Object} filters Request filter parameters.
   * @return {Promise}
   */
  listArticles(filters={}) {
    // TODO process filters
    var q = {
      unread: true,
      _sort:  "-last_modified"
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
    return this._wrap(this.client({
      path: `/articles/${params.id}`
    }));
  }

  /**
   * PATCH /articles/<id>
   * @param  {Object} entity Updated entity.
   * @return {Promise}
   */
  updateArticle(entity={}) {
    return this._wrap(this.client({
      method: "PATCH",
      path: `/articles/${entity.id}`,
      entity: entity
    }));
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

  /**
   * Creates a new batch processor.
   * @return {Batch}
   */
  createBatch(defaults={}) {
    return new Batch(this, defaults);
  }

  /**
   * POST /batch
   *
   * Note: Use the createBatch() method to benefit from a more convenient API to
   * enqueue requests.
   *
   * @see    Batch
   * @param  {Object} query The batch query object.
   * @return {Promise}
   */
  batch(query) {
    return this._wrap(this.client({
      method: "POST",
      path: "/batch",
      entity: query
    }));
  }
}
