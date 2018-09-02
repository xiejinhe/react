const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
module.exports = webpackMerge(baseConfig, {
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  // 打包bundle时候过滤掉这些包
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    filename: 'server-entry.js',
    // 打包出来的js，所使用的模块加载方案，可以是：umd cmd amd commonjs
    libraryTarget: 'commonjs2'
  }
})
