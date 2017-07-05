process.env.NODE_ENV = 'production'

var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base')

var webpackConfig = merge(baseWebpackConfig, {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        screw_ie8: false
      },
      compress: {
        warnings: false,
        screw_ie8: false
      },
      output: {
        screw_ie8: false
      },
      sourceMap: true
    }),
  ]
})

module.exports = webpackConfig