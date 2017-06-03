let Koa = require('koa')
let mount = require('koa-mount')
let helmet = require('koa-helmet')
let serve = require('koa-static')
let session = require('koa-session')
let ratelimit = require('koa-ratelimit')
let RedisStore = require('koa-redis')
let Redis = require('ioredis')
let { registerApi } = require('./api')
let { secretKeys, uploadDir } = require('../config')
require('./schedule')

let app = new Koa()

app.keys = secretKeys

app.use(helmet())

app.use(ratelimit({
  db: new Redis(),
  duration: 60000, // 1分钟允许最多600次，平均1秒10次
  max: 600,
  errorMessage: 'Sometimes You Just Have to Slow Down.',
  id: ctx => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  }
}))

app.use(async (ctx, next) => {
  let start = Date.now()
  await next()
  let end = Date.now()
  let took = end - start
  console.log(`${ctx.method} ${ctx.url} - ${took}ms`)
})

app.use(session({
  store: new RedisStore(),
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true /** (boolean) signed or not (default true) */
}, app))

app.use(mount('/upload', serve(uploadDir)))

registerApi(app)

module.exports = app
