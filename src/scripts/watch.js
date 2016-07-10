var fs = require('fs');
var watch = require('watch');
var styles = require('./styles');
var pub = require('./pub');
var pack = require('./pack');
var server = require('./serve');

exports.start = function addWatchers() {
  watch.watchTree('src/public', pub.publish);
  watch.watchTree('src/css', styles.render);
  pack.watch(server.serve);
};

exports.start();