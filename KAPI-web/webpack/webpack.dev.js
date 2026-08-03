const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const common = require('./webpack.common.js')

const config = Object.assign({}, common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({ process: { env: JSON.stringify('dev') } }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './webpack.dev.html'),
      filename: 'index.html',
      chunks: ['index']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'static/image/favicon.png', to: 'favicon.png' },
      ],
    }),
  ]
})

module.exports = config