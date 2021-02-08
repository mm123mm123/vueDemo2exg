'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),  //用于从配置中解析入口点(entry point)和 加载器(loader)。
  entry: {                                 //webpack打包的起点
    app: './src/main.js'                   //将chunk命名为app  在模块化编程中，开发者将程序分解为功能离散的 chunk，并称之为 模块
  },
  output: {                                              // webpack 如何输出结果的相关选项
    path: config.build.assetsRoot,                       // 所有输出文件的目标路径
    filename: '[name].js',                               //使用入口名称作为输出bundle的名称
    publicPath: process.env.NODE_ENV === 'production'     //此选项指定在浏览器中所引用的「此输出目录对应的__公开 URL__」
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {                                             //options for resolving module requests
    extensions: ['.js', '.vue', '.json'],                // 使用的扩展名
    alias: {                                             // 可供选择的别名语法
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {                                             // 模块配置相关
    rules: [                                            // 模块规则（配置 loader、解析器等选项）
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test') ,resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
