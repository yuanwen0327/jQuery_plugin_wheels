process.env.NODE_ENV = 'development'

var webpack = require('webpack')
var baseWebpackConfig = require('./webpack.base')
var merge = require('webpack-merge')


var webpackConfig = merge(baseWebpackConfig, {

})

module.exports = webpackConfig