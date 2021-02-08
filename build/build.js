'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')                          //优雅的终端旋转器
const rm = require('rimraf')                        //删除函数，删除后执行相应函数
const path = require('path')
const chalk = require('chalk')                      //配置终端字符串样式
const webpack = require('webpack')                  //node的webpack函数，导入的 webpack 函数需要传入一个 webpack 配置对象，当同时传入回调函数时就会执行 webpack compiler（也就是开始编译）
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
