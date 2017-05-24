let Router = require('koa-router')
let { basename } = require('path')
let { koaJson, koaUpload } = require('./util')
let { USERS, ORDERS, PRODUCTS } = require('../const')
let { env } = require('../../config')
let { findBy } = require('../dao')

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
  ctx.set('Access-Control-Allow-Origin', ctx.get('Origin'))
  await next()
})

// api options method
apiRouter.options('*', async (ctx, next) => {
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  ctx.set('Access-Control-Allow-Origin', ctx.get('Origin'))
  ctx.status = 204
  await next()
})

apiRouter.post('/ap/login', koaJson, async ctx => {
  let { account, password } = ctx.request.body
  let matched = await findBy(USERS, {
    filter: { account, password },
    fields: ['uid', 'name', 'roles']
  })
  if (matched) {
    ctx.session.user = matched
    ctx.body = { ok: 1 }
  } else {
    ctx.session = null
    ctx.throw(400, new Error('登录失败'))
  }
})

apiRouter.post('/ap/logout', ctx => {
  ctx.session = null
  ctx.body = { ok: 1 }
})

apiRouter.get('/ap/session', ctx => {
  let { user } = ctx.session
  // 改为直接返回user 不报错 避免网页出现过多 红色错误请求
  ctx.body = { user }
})

// todo: image specified upload
apiRouter.post('/ap/upload', koaUpload, ctx => {
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
