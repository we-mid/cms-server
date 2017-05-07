let Router = require('koa-router')
let { basename } = require('path')
let { koaUpload } = require('./util')
let { USERS, ORDERS, PRODUCTS } = require('../const')
let { env } = require('../../config')

exports.registerApi = registerApi

let apiRouter = new Router({ prefix: '/api' })

// api error-handling
// https://github.com/koajs/koa/blob/master/docs/error-handling.md
apiRouter.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (env === 'production') {
      ctx.body = { error: 'Internal Server Error' }
    } else {
      ctx.body = { error: err.message }
    }
    ctx.status = err.status || 500
    console.error('api error:', err)
  }
})

// api cors
apiRouter.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.set('Access-Control-Allow-Origin', '*')
  await next()
})

// api options method
apiRouter.options('*', async (ctx, next) => {
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.status = 204
  await next()
})

apiRouter.post('/logout', ctx => {
  ctx.session = null
  ctx.body = { ok: 1 }
})

// todo: image specified upload
apiRouter.post('/upload', koaUpload, ctx => {
  let { file } = ctx.request.body.files || {}
  let { path } = file
  let id = basename(path)
  ctx.body = { id }
})

;[USERS, ORDERS, PRODUCTS].forEach(resource => {
  let { registerResource } = require(`./${resource}`)
  registerResource(apiRouter)
})

function registerApi (app) {
  app.use(apiRouter.routes())
  // app.use(apiRouter.allowedMethods())
}
