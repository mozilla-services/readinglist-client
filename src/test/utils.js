/**
 * Test utils.
 */

"use strict";

/**
 * Simple querySelector alias.
 *
 * @param  {ReactComponent} view  React component.
 * @param  {String}         sel   CSS3 selector.
 * @return {DOMElement|null}
 */
function $(view, sel) {
  return view.getDOMNode().querySelector(sel);
}

/**
 * Simple querySelectorAll alias.
 *
 * @param  {ReactComponent} view  React component.
 * @param  {String}         sel   CSS3 selector.
 * @return {NodeList|null}
 */
function $$(view, sel) {
  return [].slice.call(view.getDOMNode().querySelectorAll(sel));
}

/**
 * This is mostly revamping Sinon's fake server.respondWith function, mostly to
 * make it easier to use & compose.
 *
 * @param  {Object} server   The sinon fake server object.
 * @param  {String} endpoint Endpoint, eg. "GET /articles"
 * @param  {Object} response Response options.
 */
function respondWith(server, endpoint, response={}) {
  var {method, path} = endpoint.split(" ");
  server.respondWith(method, path, [
    response.status || 200,
    Object.assign({}, {
      "Content-Type": "application/json;encoding=UTF-8"
    }, response.headers || {}),
    JSON.stringify(response.body || "")
  ]);
}

module.exports = {
  $: $,
  $$: $$,
  respondWith: respondWith
};
