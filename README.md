Readinglist client
==================

[![Build Status](https://travis-ci.org/n1k0/readinglist-client.svg?branch=master)](https://travis-ci.org/n1k0/readinglist-client)

This is work in progress at a temporary location.

Installation
------------

Required nodejs v0.10.29+ and npm v2.1.0+.

    $ npm install

Configuration
-------------

TODO

Local dev server
----------------

    $ npm run dev

### Notes:

- This local development server will watch for local asset changes and live-reload the page automatically.
- The address used is http://localhost:4000

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

Building
--------

    $ npm run build

Note: Result is then available in the `build/` subfolder. This is what should be deployed to production.
