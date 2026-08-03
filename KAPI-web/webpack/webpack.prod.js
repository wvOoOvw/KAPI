const webpack = require('webpack')
const path = require('path')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = Object.assign({}, common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({ process: { env: JSON.stringify('prod') } }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './webpack.prod.html'),
      filename: 'index.html',
      chunks: ['index']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'static/image/favicon.png', to: 'favicon.png' },
      ],
    }),
    new CleanWebpackPlugin({
      currentAssets: []
    }),
  ]
})

module.exports = config