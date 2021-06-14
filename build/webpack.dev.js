const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ProgressBarWebpackPlugin(),
    //  you should know that the HtmlWebpackPlugin by default will generate its own index.html
    new HtmlWebpackPlugin({
      favicon: './assets/img/logo.ico',
      template: './index.html',
      title: 'x-sheet',
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[contenthash].css',
      // chunkFilename: devMode ? '[id].[hash].css' : '[id].css',
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
  },
  devServer: {
    host: '127.0.0.1',
    contentBase: '../dist',
  },
});
