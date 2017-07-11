const path = require('path');
const utils = require('./utils')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// let libraryName = 'jquery.navfloat';

module.exports = {
  entry: utils.getEntry(resolve("src/*/index.js")),
  devtool: 'source-map',
  output: {
    path: resolve('/dist'),
    // path: '/dev/js/libs/jqPlugin',
    filename: process.env.NODE_ENV === 'production' ?
      'jquery.[name].min.js' : 'jquery.[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  }
};