"use strict";

/**
 * Simple querySelector alias for React components.
 *
 * @param  {ReactComponent} view  React component.
 * @param  {String}         sel   CSS3 selector.
 * @return {DOMElement|null}
 */
export function $(view, sel) {
  return view.getDOMNode().querySelector(sel);
}

/**
 * Simple querySelectorAll alias for React components.
 *
 * @param  {ReactComponent} view  React component.
 * @param  {String}         sel   CSS3 selector.
 * @return {NodeList|null}
 */
export function $$(view, sel) {
  return [].slice.call(view.getDOMNode().querySelectorAll(sel));
}

/**
 * Serialized data dump utility.
 *
 * @param  {Any} o
 */
export function jdump(o) {
  console.log(JSON.stringify(o, null, 4));
}

/**
 * This is mostly revamping Sinon's fake server.respondWith function, mostly to
 * make it easier to use & compose.
 *
 * @param  {Object} server   The sinon fake server object.
 * @param  {String} endpoint Endpoint, eg. "GET /articles"
 * @param  {Object} response Response options.
 */
export function respondWith(server, endpoint, response={}) {
  var {method, path} = endpoint.split(" ");
  server.respondWith(method, path, [
    response.status || 200,
    Object.assign({}, {
      "Content-Type": "application/json;encoding=UTF-8"
    }, response.headers || {}),
    JSON.stringify(response.body || "")
  ]);
}

export function asyncAssert(done, fn) {
  setImmediate(() => { fn(); done(); });
}

export function fulfiller(...rest) {
  return function(fulfill) {
    fulfill(...rest);
  };
}

export function rejecter(...rest) {
  return function(_, reject) {
    reject(...rest);
  };
}

export function returns(what) {
  return function() {
    return what;
  };
}

export function returnPromise(handler) {
  return returns(new Promise(handler));
}
