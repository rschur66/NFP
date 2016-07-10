var fs = require('fs');
var path = require('path');
var del = require('del');

var copyRecursiveSync = function (src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    if(!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (child) {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.writeFileSync(dest, fs.readFileSync(src));
  }
};

exports.publish = function () {
  del.sync(['build/public/fonts/*','build/public/img/*']);
  if(!fs.existsSync('build')) fs.mkdirSync('build');
  copyRecursiveSync('src/public','build/public');
  console.log('Static assets published.');
};

if (!module.parent) {
  exports.publish();
}