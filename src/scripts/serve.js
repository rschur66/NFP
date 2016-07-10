var childProcess = require('child_process');

var child = null;

exports.serve = function () {
  if (child) child.kill('SIGHUP');
  child = childProcess.fork('build/server.js');
};

