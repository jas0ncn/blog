const path = require('path')

module.exports = {
  articleRoot: '/articles/',
  build: {
    assetsPublicPath: 'https://cdn.ijason.cc/blog/',
    assetsRoot: path.resolve(__dirname, '../dist/static')
  },
  dev: {
    assetsPublicPath: '/',
    assetsRoot: path.resolve(__dirname, '../static')
  }
}
