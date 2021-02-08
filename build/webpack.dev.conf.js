'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,                                    // 通过为浏览器调试工具提供极其详细的源映射的元信息来增强调试能力

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',                                   //配置在客户端的日志等级，这会影响到你在浏览器开发者工具控制台里看到的日志内容
    historyApiFallback: true,                                    //当使用 HTML5 History API 时, 所有的 404 请求都会响应 index.html 的内容
    hot: true,                                                   //模块热替换(HMR - hot module replacement)功能会在应用程序运行过程中，替换、添加或删除 模块，而无需重新加载整个页面。
    compress: true,                                              //通过gzip压缩代码
    host: HOST || config.dev.host,                               //指定要使用的 host使得服务器可从外部访问
    port: PORT || config.dev.port,                               //指定端口号
    open: config.dev.autoOpenBrowser,                            //告诉 dev-server 在服务器启动后打开浏览器
    overlay: config.dev.errorOverlay                             //出现编译器错误或警告时，在浏览器中显示。
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,                     //捆绑的文件将在此路径下的浏览器中可用   https://webpack.docschina.org/configuration/dev-server/#devserverpublicpath-
    proxy: config.dev.proxyTable,                                //设置如何代理接口
    quiet: true, // necessary for FriendlyErrorsPlugin           //启用 devServer.quiet 后，除了初始启动信息外，什么都不会写入控制台。 这也意味着来自webpack的错误或警告是不可见的。
    watchOptions: {
      poll: config.dev.poll,                                     //控制监听文件的选项
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'vue-element-admin'
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
