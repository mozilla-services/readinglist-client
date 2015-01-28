"use strict";

var React = require("react");
var App = require("./app");
var API = require("./api.js");
var baseUrl = process.env.READINGLIST_SERVER_BASEURL || "http://0.0.0.0:8000/v0";

var api = new API(baseUrl);

React.render(<App api={api} />, document.querySelector("#app"));
