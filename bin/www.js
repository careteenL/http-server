#! /usr/bin/env node

const commander = require('commander')

const version = require('../package.json').version

// 设置 --help 时的提示信息
let args = commander
  .version(version, '-v, --version') // 设置版本号
  .option('-p, --port <n>', 'server port') // 端口号参数
  .option('-a, --address <n>', 'server address [0.0.0.0]') // 主机参数
  .option('-d, --dir <n>', 'server show list') // 启动服务的所在路径

// 添加使用指南
commander.on('--help', _ => {
  console.log('')
  console.log('@careteen-http-server')
  console.log('@careteen-hs')
  console.log('@careteen-hs --port 8080')
  console.log('@careteen-hs --dir /tmp')
  console.log('@careteen-hs --address 127.0.0.1')
})

// 将命令行参数传入
commander.parse(process.argv)

// 设置默认参数
let defaultConf = Object({
  dir: process.cwd(),
  address: '127.0.0.1',
  port: 8080
}, args)

// 启动服务
const HttpServer = require('../src/server.js')
let hs = new HttpServer(defaultConf)
hs.start()