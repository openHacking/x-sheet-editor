const path = require('path');
const common = require('./webpack.config.js');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')["BundleAnalyzerPlugin"];
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ProgressBarWebpackPlugin(),
    new BundleAnalyzerPlugin(),
    //  you should know that the HtmlWebpackPlugin by default will generate its own index.html
    new HtmlWebpackPlugin({
      favicon: './assets/img/logo.ico',
      template: './index.html',
      title: 'x-sheet',
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].css',
      // chunkFilename: devMode ? '[id].[hash].css' : '[id].css',
    }),
  ],
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
});
