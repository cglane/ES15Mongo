var path = require('path');
var webpacke = require('webpack');

module.exports = {
  entry: './app.js',
  output: { path: __dirname, filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.js/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /.html/,
        loader: 'html'
      }
    ]
  }
};
