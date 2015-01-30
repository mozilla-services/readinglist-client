"use strict";

import React from "react/addons";
import API from "./api";
import { ArticleStore, stores } from "./flux";
import App from "./components/App";

// XXX handle this with envify
var serverUrl = process.env.READINGLIST_SERVER_BASEURL || "http://0.0.0.0:8000/v0";

stores.register({
  articleStore: new ArticleStore(new API(serverUrl))
});

React.render(<App />, document.querySelector("#app"));
