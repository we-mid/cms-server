let Koa = require('koa')
let KoaMount = require('koa-mount')
let KoaStatic = require('koa-static')
let KoaSession = require('koa-session')
let { registerApi } = require('./api')
let { secretKeys, uploadDir } = require('../config')

let app = new Koa()

app.keys = secretKeys

app.use(async (ctx, next) => {
  let start = Date.now()
  await next()
  let end = Date.now()
  let took = end - start
  console.log(`${ctx.method} ${ctx.url} - ${took}ms`)
})

app.use(KoaSession({
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true /** (boolean) signed or not (default true) */
}, app))

app.use(KoaMount('/upload', KoaStatic(uploadDir)))

registerApi(app)

module.exports = app
