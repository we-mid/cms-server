let KoaBody = require('koa-body')
let Router = require('koa-router')
let _ = require('lodash')
let { getColl } = require('./db')
let { PRODUCTS } = require('./const')
let { env } = require('../config')

exports.registerApi = registerApi

let apiRouter = new Router({ prefix: '/api' })
apiRouter.use(KoaBody())

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

apiRouter.post(`/${PRODUCTS}/create`, async ctx => {
  let { title, description } = ctx.request.body
  let doc = { title, description }
  let coll = await getColl(PRODUCTS)
  let ret = await coll.insertOne(doc)
  ctx.body = { ret }
})

apiRouter.post(`/${PRODUCTS}/update`, async ctx => {
  let { _id, _ids } = ctx.request.body
  let { title, description } = ctx.request.body
  let update = { $set: { title, description } }
  let coll = await getColl(PRODUCTS)
  let ret
  
  if (_id) {
    let filter = { _id }
    ret = await coll.updateOne(filter, update)
  } else if (_ids) {
    let filter = { _id: { $in: _ids } }
    ret = await coll.updateMany(filter, update)
  } else {
    throw new Error('either of _id or _ids is required')
  }
  ctx.body = { ret }
})

apiRouter.post(`/${PRODUCTS}/delete`, async ctx => {
  let { _id, _ids } = ctx.request.body
  let coll = await getColl(PRODUCTS)
  let ret

  if (_id) {
    let filter = { _id }
    ret = await coll.deleteOne(filter)
  } else if (_ids) {
    let filter = { _id: { $in: _ids } }
    ret = await coll.deleteMany(filter)
  } else {
    throw new Error('either of _id or _ids is required')
  }
  ctx.body = { ret }
})

// dont forget to `parseInt` the number params
apiRouter.get(`/${PRODUCTS}/list`, async (ctx, next) => {
  let filter = {} // todo
  ctx.state.listFilter = filter
  await next()
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
  let { page, skip, limit } = ctx.query
  limit = parseInt(limit) || 10
  if ('skip' in ctx.query) {
    skip = parseInt(skip) || 0
  } else {
    page = parseInt(page) || 1
    skip = limit * (page - 1)
  }
  listOptions = listOptions || {}
  listOptions = _.defaults(listOptions, { skip, limit })
  ctx.state = listOptions
  await next()
})

// middleware: /list db.find()
apiRouter.get('/:resource/list', async ctx => {
  let { resource } = ctx.params
  let { listFilter, listOptions } = ctx.state
  let coll = await getColl(resource)
  let docs = await coll.find(listFilter, listOptions).toArray()
  ctx.body = { docs }
})

function registerApi (app) {
  app.use(apiRouter.routes())
  app.use(apiRouter.allowedMethods())
}
