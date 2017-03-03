const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  entry: [
    './src/javascripts/main.js',
    './src/stylesheets/main.scss',
  ],
  resolve: {
    modules: [
      './src/javascripts',
      'node_modules',
    ],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: !IS_PRODUCTION,
            },
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')(),
              ],
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: !IS_PRODUCTION,
              includePaths: ['node_modules/sanitize.css', 'node_modules/repetitivo/lib'],
            },
          }],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('./stylesheets/[name].css'),
  ],
  output: {
    filename: './javascripts/[name].js',
  },
  devtool: IS_PRODUCTION ? false : 'source-map'
};
