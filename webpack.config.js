var webpack = require('webpack');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .forEach(function (mod) {
    nodeModules[mod] = mod;
  });
console.log('Excluding ' + Object.keys(nodeModules).length + ' node modules.');

module.exports = {
  release: [{
    entry: [__dirname + '/src/server.js'],
    output: {
      path: './build',
      filename: 'server.js',
      publicPath: '/',
      libraryTarget: 'commonjs2'
    },
    cache: true,
    debug: false,
    devtool: 'sourcemap',
    target: 'node',
    node: {
      __dirname: true
    },
    excludes: /node_modules/,
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            plugins: ['transform-runtime'],
            presets: ['es2015', 'react', 'stage-0']
          }
        },
        {
          test: /\.json$/,
          exclude: /node_modules/,
          loader: 'json-loader'
        }
      ],
      plugins: [new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production')}})]
    },
    externals: nodeModules
  },
    {
      entry: [__dirname + '/src/app.js'],
      output: {
        path: './build/public',
        filename: 'app.js',
        publicPath: '/'
      },
      target: 'web',
      cache: true,
      debug: false,
      devtool: 'sourcemap',
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
              plugins: ['transform-runtime'],
              presets: ['es2015', 'react', 'stage-0']
            }
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production')}}),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, exclude: /braintree/i, sourceMap: false})
      ]
    }],
  dev: [{
    entry: [__dirname + '/src/server.js'],
    output: {
      path: './build',
      filename: 'server.js',
      publicPath: '/',
      libraryTarget: 'commonjs2'
    },
    cache: true,
    debug: true,
    devtool: 'sourcemap',
    target: 'node',
    node: {
      __dirname: true
    },
    excludes: /node_modules/,
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            plugins: ['transform-runtime'],
            presets: ['es2015', 'react', 'stage-0']
          }
        },
        {
          test: /\.json$/,
          exclude: /node_modules/,
          loader: 'json-loader'
        }
      ]
    },
    externals: nodeModules
  },
    {
      entry: [__dirname + '/src/app.js'],
      output: {
        path: './build/public',
        filename: 'app.js',
        publicPath: '/'
      },
      target: 'web',
      cache: true,
      debug: true,
      devtool: 'sourcemap',
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
              plugins: ['transform-runtime'],
              presets: ['es2015', 'react', 'stage-0']
            }
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          }
        ]
      },
      plugins: []
    }]
};