let KoaBody = require('koa-body')
let Router = require('koa-router')
let _ = require('lodash')
let { getColl } = require('../db')
let { PRODUCTS } = require('../const')
let { env } = require('../../config')

exports.registerApi = registerApi

let apiRouter = new Router({ prefix: '/api' })
apiRouter.use(KoaBody())

apiRouter.use(async (ctx, next) => {
  let { body } = ctx.request
  if (body && _.isString(body)) {
    try {
      ctx.request.body = JSON.parse(body)
    } catch (err) {
      throw new Error(`invalid json body, got: ${body}`)
    }
  }
  await next()
})

// api cors
apiRouter.use(async (ctx, next) => {
  console.log('api cors')
  if (ctx.method === 'OPTIONS') {
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    ctx.status = 204
  }
  ctx.set('Access-Control-Allow-Origin', '*')
  await next()
})

// api error-handling
// https://github.com/koajs/koa/blob/master/docs/error-handling.md
apiRouter.use(async (ctx, next) => {
  console.log('api error handleing')
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

;[PRODUCTS].forEach(resource => {
  let { registerResource } = require(`./${resource}`)
  registerResource(apiRouter)
})

// middleware: /list validation
apiRouter.get('/:resource/list', async (ctx, next) => {
  let { resource } = ctx.params
  let { listFilter } = ctx.state
  if (!listFilter) {
    throw new Error(`missing listFilter, resource key got "${resource}"`)
  }
  await next()
})

// middleware: /list default pagination logic
apiRouter.get('/:resource/list', async (ctx, next) => {
  let { listOptions } = ctx.state
  let { page, skip, limit, sort } = ctx.query
  limit = parseInt(limit) || 10
  if ('skip' in ctx.query) {
    skip = parseInt(skip) || 0
  } else {
    page = parseInt(page) || 1
    skip = limit * (page - 1)
  }
  if (sort) {
    sort = { createdAt: +sort }
  }
  listOptions = listOptions || {}
  listOptions = _.defaults(listOptions, { skip, limit, sort })
  ctx.state.listOptions = listOptions
  await next()
})

// middleware: /list db.find()
apiRouter.get('/:resource/list', async ctx => {
  let { resource } = ctx.params
  let { listFilter, listOptions } = ctx.state
  let coll = await getColl(resource)
  let [total, docs] = await Promise.all([
    coll.count(listFilter),
    coll.find(listFilter, listOptions).toArray()
  ])
  ctx.body = { total, docs }
})

function registerApi (app) {
  app.use(apiRouter.routes())
  // app.use(apiRouter.allowedMethods())
}
