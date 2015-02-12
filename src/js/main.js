"use strict";

import React from "react/addons";
import API from "./api";
import { AuthStore, ArticleStore, stores } from "./flux";
import App from "./components/App";

// XXX handle this with envify
var serverUrl = process.env.READINGLIST_SERVER_BASEURL || "http://0.0.0.0:8000/v0";

var api = new API(serverUrl);

stores.register({
  authStore: new AuthStore(api),
  articleStore: new ArticleStore(api)
});

React.render(<App />, document.querySelector("#app"));
