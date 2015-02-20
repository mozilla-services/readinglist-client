"use strict";

import React from "react/addons";
import API from "./api";
import ContentManager from "./content";
import { AuthStore, ArticleStore, stores } from "./flux";
import App from "./components/App";

// XXX handle this with envify
var serverUrl = process.env.READINGLIST_SERVER_BASEURL || "http://0.0.0.0:8000/v0";
var proxyServerUrl = process.env.READABLE_PROXY_URL    || "http://0.0.0.0:3000/get";
var debug = process.env.NODE_ENV === "development";

var api = new API(serverUrl, {debug: debug});
var contentManager = new ContentManager(proxyServerUrl, {debug: debug});

stores.register({
  authStore: new AuthStore(api, {debug: debug}),
  articleStore: new ArticleStore(api, contentManager, {debug: debug})
});

React.render(<App />, document.querySelector("#app"));
