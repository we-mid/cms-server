let Koa = require('koa')
let { registerApi } = require('./api')

let app = new Koa()

app.use(async (ctx, next) => {
  let start = Date.now()
  await next()
  let end = Date.now()
  let took = end - start
  console.log(`${ctx.method} ${ctx.url} - ${took}ms`)
})

registerApi(app)

module.exports = app
