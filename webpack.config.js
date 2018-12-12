/* eslint-disable flowtype/require-valid-file-annotation */
'use strict'
/*******************************************************************************
The MIT License (MIT)

Copyright (c) 2015 Logan Barnett (logustus@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*******************************************************************************/
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BabelFlowWebpackPlugin = require('babel-flow-webpack-plugin')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const webpack = require('webpack')
const R = require('ramda')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const VendorExtractText = new ExtractTextPlugin({
  allChunks: true,
  filename: 'vendor.[hash].css',
})
const AppExtractText = new ExtractTextPlugin({
  allChunks: true,
  filename: 'main.[hash].css',
  ignoreOrder: true,
})

module.exports = {
  context: path.join(__dirname, 'client'),
  devServer: {
    // Allow external connections for demoing and remote work.
    disableHostCheck: true,
    historyApiFallback: {
      disableDotRule: true,
      index: '/index.html',
      rewrites: [
        // As asinine as this may seem, it's required for the historyApiFallback
        // to actually do its thing.
        { from: /.*/, to: '/index.html' },
      ],
    },
    host: '0.0.0.0',
    hot: true,
    port: 9000,
    publicPath: '/',
  },
  entry: {
    main: [
      // 'webpack/hot/dev-server',
      // 'webpack-hot-middleware/client',
      // 'babel-polyfill',
      './app.jsx',
    ],
  },
  mode: 'production',
  module: {
    rules: [
      {
        exclude: path.resolve(__dirname, 'client'),
        include: /node_modules/,
        test: /\.css$/,
        use: VendorExtractText.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: false,
                modules: false,
                sourceMap: false,
              },
            },
          ],
        }),
      },
      {
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'client'),
        test: /\.css$/,
        use: [
          'css-hot-loader',
        ].concat(
          AppExtractText.extract({
            use: [
              'css-modules-flow-types-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: true,
                  localIdentName: '[name]__[local]__[hash:base64:5]',
                  minimize: true,
                  modules: true,
                  sourceMap: true,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [
                    autoprefixer(),
                  ],
                  sourceMap: true,
                },
              },
            ],
          }),
        ),
      },
      {
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'client'),
        test: /\.jsx?$/,
        use: [
          'babel-loader',
          'eslint-loader',
        ],
      },
      {
        exclude: /index\.html$/,
        include: path.resolve(__dirname, 'client'),
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            // minimize: false,
            // removeComments: false,
            // collapseWhitespace: false,
          },
        },
      },
      {
        include: path.resolve(__dirname, 'client'),
        test: /\.svg$/,
        use: {
          loader: 'svg-sprite-loader',
        },
      },
      {
        include: path.resolve(__dirname, 'client'),
        test: /\.(jpe?g|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: 'assets/images/[name].[ext]',
            prefix: '/assets/images',
          },
        },
      },
      {
        include: path.resolve(__dirname, 'client'),
        test: /\.(woff|woff2|eot|ttf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1000,
            prefix: 'font',
          },
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        exclude: /vendor/,
        include: /main/,
        parallel: true,
        sourceMap: true,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'all',
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new BabelFlowWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    AppExtractText,
    VendorExtractText,
    new HtmlWebpackPlugin({
      chunks: ['main', 'vendor'],
      filename: 'index.html',
      inject: true,
      template: 'index.html',
    }),
    new StyleLintPlugin({
      configFile: './stylelint.config.js',
      emitErrors: true,
      // The directory is relative to Webpack's context path.
      files: ['**/*.css'],
      quiet: false,
    }),
    new webpack.SourceMapDevToolPlugin({
      exclude: [ /vendor.*\.js/ ],
      filename: '[name].js.map',
      include: [ /main.*\.js/ ],
    }),
    new webpack.SourceMapDevToolPlugin({
      exclude: [ /vendor.*\.css/ ],
      filename: '[name].css.map',
      include: [ /main.*\.css/ ],
    }),
  ],
}
