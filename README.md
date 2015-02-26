Readinglist client
==================

[![Build Status](https://travis-ci.org/mozilla-services/readinglist-client.svg?branch=master)](https://travis-ci.org/mozilla-services/readinglist-client) [![Dependency Status](https://www.versioneye.com/user/projects/54d8751237de4a036f000002/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54d8751237de4a036f000002)

This is work in progress at a temporary location.

Installation
------------

Requires nodejs v0.10.29+ and npm v2.1.0+. To install the required dependencies:

    $ npm install

This Web client also requires a running instance of the [Readinglist server](https://github.com/mozilla-services/readinglist).

Configuration
-------------

You can configure the client using the following environment variables:

- `CLIENT_DEVICE_IDENTIFIER`: The client identifier name; used when updating article read status (default: `readinglist-client`).
- `MAX_ITEMS_PER_PAGE`: The maximum number of articles per result page; default: `10`.
- `NODE_ENV`: The nodejs environment name; default: `production`.
- `READINGLIST_SERVER_BASEURL`: the Readinglist server base URL; default: `http://0.0.0.0:8000/v0`.
- `READABLE_PROXY_URL`: the [readable-proxy](https://github.com/n1k0/readable-proxy) server base endpoint; default: `http://0.0.0.0:3000/get`.

Environment variables will be used during the build step to replace matching placeholders in resulting js assets. Eg. that means if you want to override the default API base url running the local development server, you can run:

    $ READINGLIST_SERVER_BASEURL=http://my.alt.domain.tld npm start

Building & deploying
--------------------

    $ READINGLIST_SERVER_BASEURL="http://production.server.tld" \
      READABLE_PROXY_URL="https://readable-proxy.herokuapp.com/get" \
      npm run build

Result is then available in the `build/` subfolder. This is what should be deployed to production.

Local dev server
----------------

    $ npm start

### Notes:

- This local development server will watch for local asset changes and live-reload the page automatically;
- It will set `NODE_ENV`to `development`;
- The address used is `http://localhost:4000`.

Linting
-------

    $ npm run lint

Tests
-----

This will run the unit test suite against a Karma browser matrix and exits.

    $ npm test

TDD
---

This will launch a live Karma server watching and running tests on each source change.

    $ npm run tdd
