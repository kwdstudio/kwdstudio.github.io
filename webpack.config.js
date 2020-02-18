const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  mode: NODE_ENV,
  entry: {
    application: path.join(__dirname, 'src/javascripts/application.js'),
    main: path.join(__dirname, 'src/stylesheets/main.scss'),
  },
  output: {
    path: path.resolve(__dirname),
    filename: 'javascripts/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: NODE_ENV === 'development',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: NODE_ENV === 'development',
              sassOptions: {
                outputStyle: 'compressed',
                includePaths: [
                  path.join(__dirname, 'node_modules/repetitivo/lib'),
                  path.join(__dirname, 'node_modules/normalize.css'),
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'stylesheets/[name].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    port: 9000,
  },
};
