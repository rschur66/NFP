var webpack = require('webpack');
var options = require('../../webpack.config');

var devCompiler = webpack(options.dev);
var relCompiler = webpack(options.release);
var building = false;

exports.watch = function (cb) {
  console.log('Building DEVELOPMENT build with live reloading. Should take ~30 seconds.');
  devCompiler.watch({
    aggregateTimeout: 100,
    poll: false
  }, function (err, stats) {
    if (err) console.error('Error building WebPack object: ' + err);
    else if (stats.toJson().assets[0].name === 'server.js' && cb)  cb();
  });
};

exports.run = function () {
  relCompiler.run(function (err, stats) {
    console.log('Building RELEASE build. Should take...  some time.  (Go get coffee.)');
    var statsJson = stats.toJson();
    if (stats.hasErrors()) {
      console.error('Errors building WebPack package: ');
      statsJson.errors.forEach(function (e) {
        console.error(e)
      });
    }
    if (stats.hasWarnings()) {
      console.log('Warnings building WebPack package: ', statsJson.warnings);
      statsJson.warnings.forEach(function (e) {
        console.error(e)
      });
    }
  });
};

if (!module.parent) {
  exports.run();
}