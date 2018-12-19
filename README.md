# [http-server](https://github.com/careteenL/http-server)
[![](https://img.shields.io/badge/Powered%20by-httpServer-brightgreen.svg)](https://github.com/careteenL/http-server)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/careteenL/http-server/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/careteenL/http-server.svg?branch=master)](https://travis-ci.org/careteenL/http-server)
[![npm](https://img.shields.io/badge/npm-0.1.0-orange.svg)](https://www.npmjs.com/package/@careteen/http-server)
[![NPM downloads](http://img.shields.io/npm/dm/@careteen/http-server.svg?style=flat-square)](http://www.npmtrends.com/@careteen/http-server)

<!-- [English Document](./README.en_US.md) -->

学习并仿写`http-server`，目前已提供基础功能。

- [x] 支持命令行帮助
- [x] 实现缓存
- [x] 实现压缩
- [ ] 丰富文件夹显示页面
- [ ] 美化404页面

## 快速使用

全局安装
```shell
npm i -g @careteen/http-server
```

在需要启动服务的地方执行下面命令
```shell
@careteen-http-server
# or 简写
@careteen-hs
```
默认端口是8080

查看命令帮助
```shell
@careteen-hs --help
```

指定端口访问
```shell
@careteen-hs --port 3000
# or
@careteen-hs -p 3000
```

指定主机
```shell
@careteen-hs --address 127.0.0.1
# or
@careteen-hs -a 127.0.0.1
```

指定特定文件夹启动服务
```shell
@careteen-hs --dir /tmp
# or
@careteen-hs -d tmp
```

## 使用文档

- [对该库的源码解析](https://github.com/careteenL/66ball/blob/master/src/20181215-http/http-server.md)