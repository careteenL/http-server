const http = require('http')
const path = require('path')
const url = require('url')
const chalk = require('chalk')
const fs = require('mz/fs')
const mime = require('mime')
const ejs = require('ejs')
const zlib = require('zlib')

const tmplPath = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8')

// 启动服务的核心
class HttpServer {
  constructor (config) {
    this.port = config.port
    this.address = config.address
    this.dir = config.dir
    this.tmpl = tmplPath
  }
  // 处理请求
  handleRequest () {
    return async (req, res) => {
      let { pathname } = url.parse(req.url)
      pathname = decodeURI(pathname) // 处理路径为中文浏览器会自动编码
      if (pathname === '/favicon.ico') return this.sendError('Not Found', res) // 处理每次访问都会发请求的小图标
      let realPath = path.join(this.dir, pathname)
      try {
        let statObj = await fs.stat(realPath)
        console.log(`${chalk.green(statObj.isFile() ?'File:' : 'Folder:')} ${realPath}`)
        if (statObj.isFile()) { // 文件
          this.sendFile(req, res, realPath, statObj)
        } else { // 文件夹
          let dirs = await fs.readdir(realPath) // 获取文件夹的一级子目录
          dirs = dirs.map(dir => ({
            url: path.join(pathname, dir),
            dir
          }))
          let renderStr = ejs.render(this.tmpl, { dirs }) // 使用ejs渲染文件夹目录
          res.setHeader('Content-Type', 'text/html;charset=utf8')
          res.end(renderStr)
        }
      } catch (e) {
        this.sendError(e, res)
      }
    }
  }
  cache (req, res, realPath, statObj) {
    // 强制缓存
    res.setHeader('Cache-Control', 'max-age=30')
    res.setHeader('Expires', new Date(Date.now() + 5 * 1000).toLocaleString())
    let ctime = statObj.ctime // 文件修改时间
    let etag = `${ctime}_${statObj.size}`
    // 对比缓存
    res.setHeader('Last-Modified', ctime)
    res.setHeader('ETag', etag)
    // 取到请求头
    let ifModifiedSince = req.headers['if-modified-since']
    let ifNoneMatch = req.headers['if-none-match']
    // 只有当两个同时存在且和请求头中一致 才走缓存
    return ifModifiedSince && ifNoneMatch && 
      ifModifiedSince === ctime && 
      ifNoneMatch === etag
  }
  gzip (req, res) {
    // 浏览器支持什么就用什么压缩
    let encoding = req.headers['accept-encoding']
    if (encoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip')
      return zlib.createGzip()
    }
    if (encoding.includes('deflate')) {
      res.setHeader('Content-Encoding', 'deflate')
      return zlib.createDeflate()
    }    
    return false
  }
  sendFile (req, res, realPath, statObj) {
    // 缓存
    if (this.cache(req, res, realPath, statObj)) {
      res.statusCode = 304
      res.end()
      return
    }
    res.setHeader('Content-Type', `${mime.getType(realPath)};charset=utf-8`)
    // 压缩
    let zip
    if (zip = this.gzip(req, res)) { // 返回值为一个转化流
      return fs.createReadStream(realPath).pipe(zip).pipe(res)
    }
    fs.createReadStream(realPath).pipe(res)
  }
  sendError (e, res) {
    console.log(e)
    res.statusCode = 404
    res.end(`Not Found`)
  }
  start () {
    let server = http.createServer(this.handleRequest())
    server.listen(this.port, this.address, _ => {
      console.log(chalk.yellow(`Starting up http-server, serving ./
        Available on:`
      ))
      console.log(`http://${this.address}:${chalk.green(this.port)}`)
    })
  }
}

module.exports = HttpServer