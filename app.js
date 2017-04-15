let Koa = require('koa')

let app = new Koa()

app.use(ctx => {
  ctx.body = 'Hello'
})

module.exports = app
