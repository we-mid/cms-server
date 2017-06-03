let Router = require('koa-router')
let { basename } = require('path')
let { koaJson, koaUpload } = require('./util')
let { USERS, ORDERS, PRODUCTS } = require('../const')
let { findBy } = require('../dao')
let logger = require('../logger')

exports.registerApi = registerApi

let apiRouter = new Router({ prefix: '/api' })

// api error-handling
// https://github.com/koajs/koa/blob/master/docs/error-handling.md
apiRouter.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    let { code, status, message: error } = err
    status = status || 500
    ctx.body = {
      code,
      status,
      error
    }
    ctx.status = status
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
  logger.info('用户尝试登录', { account })
  if (!account) ctx.throw(400, '账号不能为空')
  if (!password) ctx.throw(400, '密码不能为空')

  let { doc: user } = await findBy(USERS, {
    filter: { account, password },
    fields: ['uid', 'name', 'roles']
  })
  if (user) {
    ctx.session.user = user
    ctx.body = { ok: 1 }
    logger.info('用户登录成功', { account })
  } else {
    ctx.session = null
    ctx.throw(400, '登录失败')
    logger.info('用户登录失败', { account })
  }
})

apiRouter.post('/ap/logout', ctx => {
  let { user } = ctx.session
  if (user) {
    logger.info('用户退出登录', { uid: user.uid })
  }
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
  let { files } = ctx.request.body
  let { file } = files || {}
  if (!file) ctx.throw(400, '上传文件不能为空')
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
