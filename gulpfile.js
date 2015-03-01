"use strict";

var gulp = require("gulp");
var path = require("path");
var browserify = require("browserify");
var envify = require("envify/custom");
var watchify = require("watchify");
var source = require("vinyl-source-stream");
var babelify = require("babelify");
var uglify = require("gulp-uglify");
var webserver = require("gulp-webserver");
var karma = require("karma").server;

var DEFAULT_ENV = "production";

var opt = {
  outputFolder: "build",
  server: {
    host: "localhost",
    port: 4000,
    livereload: true,
    open: true
  },
  envifyVars: {
    CLIENT_DEVICE_IDENTIFIER:   process.env.CLIENT_DEVICE_IDENTIFIER,
    NODE_ENV:                   process.env.NODE_ENV || DEFAULT_ENV,
    MAX_ITEMS_PER_PAGE:         process.env.MAX_ITEMS_PER_PAGE,
    READABLE_PROXY_URL:         process.env.READABLE_PROXY_URL,
    READINGLIST_SERVER_BASEURL: process.env.READINGLIST_SERVER_BASEURL
  },
  cssAssets: [
    "node_modules/bootstrap/dist/css/bootstrap.css",
    "node_modules/bootstrap/dist/css/bootstrap.css.map",
    "src/css/styles.css"
  ],
  fontAssets: [
    "node_modules/bootstrap/dist/fonts/*.*"
  ],
  jsAssets: [
    "src/js/**/*.*"
  ],
  htmlAssets: [
    "src/index.html"
  ],
  dataAssets: [
    "src/data/**/*.*"
  ],
  app: {
    src: "./src/js/main.js",
    dest: "bundle.js"
  },
  vendors: {
    target: "vendors.js",
    modules: [
      "babel/polyfill",
      "docbrown",
      "react/addons",
      "rest",
      "rest/interceptor/pathPrefix",
      "rest/interceptor/mime",
      "rest/interceptor/errorCode",
      "rest/interceptor/defaultRequest",
      "rest/interceptor/hateoas",
      "rest/interceptor"
    ]
  },
  karmaConfigPath: path.join(__dirname, "karma.conf.js")
};

/**
 * Assets tasks
 */
gulp.task("assets", [
  "assets:html",
  "assets:data",
  "assets:css",
  "assets:fonts"
]);

gulp.task("assets:html", function() {
  return gulp.src(opt.htmlAssets)
    .pipe(gulp.dest(opt.outputFolder));
});

gulp.task("assets:data", function() {
  return gulp.src(opt.dataAssets)
    .pipe(gulp.dest(opt.outputFolder));
});

gulp.task("assets:css", function() {
  return gulp.src(opt.cssAssets)
    .pipe(gulp.dest(opt.outputFolder + "/css"));
});

gulp.task("assets:fonts", function() {
  return gulp.src(opt.fontAssets)
    .pipe(gulp.dest(opt.outputFolder + "/fonts"));
});

/**
 * JS tasks
 */
gulp.task("js", ["js:vendors", "js:app"]);

gulp.task("js:vendors", function() {
  return browserify()
    .require(opt.vendors.modules)
    .bundle()
    .pipe(source(opt.vendors.target))
    .pipe(gulp.dest(opt.outputFolder + "/js"));
});

gulp.task("js:app", ["js:vendors"], function() {
  return browserify(opt.app.src)
    .external(opt.vendors.modules)
    .transform(babelify)
    .transform(envify(opt.envifyVars))
    .bundle()
    .pipe(source(opt.app.dest))
    .pipe(gulp.dest(opt.outputFolder + "/js"));
});

/**
 * Server task.
 */
gulp.task("server", function() {
   return gulp.src(opt.outputFolder)
    .pipe(webserver(opt.server));
});

/**
 * Run test once and exit.
 */
gulp.task("test", function() {
  karma.start({
    configFile: opt.karmaConfigPath,
    autoWatch: false,
    singleRun: true
  }, function(status) {
    if (status > 0) {
      console.error("Test suite failed.");
    }
    process.exit(status);
  });
});

/**
 * Watch for file changes and re-run tests on each change.
 */
gulp.task("tdd", function(done) {
  karma.start({
    configFile: opt.karmaConfigPath
  }, done);
});

/**
 * Watchify
 */
gulp.task("watchify", function() {
  var b = browserify(opt.app.src, watchify.args)
    .external(opt.vendors.modules)
    .transform(babelify)
    .transform(envify(opt.envifyVars));

  function updateBundle(w) {
    return w.bundle()
      .pipe(source(opt.app.dest))
      .pipe(gulp.dest(opt.outputFolder + "/js"));
  }

  var watcher = watchify(b);
  watcher.on("update", function() {
    updateBundle(watcher);
  });

  return updateBundle(watcher);
});

/**
 * Watch task
 * Launch a server with livereload
 */
gulp.task("watch", ["assets", "js:vendors", "watchify"], function() {
  gulp.watch(opt.cssAssets,  ["assets:css"]);
  gulp.watch(opt.dataAssets, ["assets:data"]);
  gulp.watch(opt.fontAssets, ["assets:fonts"]);
  gulp.watch(opt.htmlAssets, ["assets:html"]);
});

gulp.task("dist", ["assets", "js"], function() {
  return gulp.src(opt.outputFolder + "/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest(opt.outputFolder + "/js"));
});

gulp.task("default", ["server", "watch"]);
