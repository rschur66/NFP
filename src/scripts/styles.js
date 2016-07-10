var sass = require('node-sass');
var fs = require('fs');

exports.render = function () {
  sass.render({
    file: 'src/css/master.scss',
    sourceMap: true,
    outFile: 'build/public/master.css'
  }, function (err, result) {
    if (err) console.error('Failed to generate CSS package: ' + err);
    else if (result['css'] && result['map']) {
      fs.writeFileSync('build/public/master.css', result['css'], 'utf8');
      fs.writeFileSync('build/public/master.css.map', result['map'], 'utf8');
      console.log('Styles generated.'); 
    }
  });
};

if (!module.parent) {
  exports.render();
}