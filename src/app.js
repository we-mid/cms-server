let Koa = require('koa')
let KoaBody = require('koa-body')
let Router = require('koa-router')

let app = new Koa()
let koaBody = KoaBody()
let apiRouter = new Router({ prefix: '/api' })

let { getDb } = require('./db')

let collNameProducts = 'products'

apiRouter.use(koaBody)

apiRouter.post('/products/create', async ctx => {
  let db = await getDb()
  let coll = await db.collection('products')

  let { title, description } = ctx.request.body
  let doc = { title, description }
  let ret = await coll.insertOne(doc)
  ctx.body = { ret }
})

apiRouter.post('/products/update', async ctx => {
  let db = await getDb()
  let coll = await db.collection('products')

  let { _id, _ids } = ctx.request.body
  let { title, description } = ctx.request.body
  let update = { $set: { title, description } }
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

apiRouter.post('/products/delete', async ctx => {
  let db = await getDb()
  let coll = await db.collection('products')
  let { _id, _ids } = ctx.request.body
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

apiRouter.get('/products/list', async ctx => {
  let db = await getDb()
  let coll = await db.collection('products')

  let { page, limit } = ctx.query
  page = parseInt(page) || 1
  limit = parseInt(limit) || 20
  let filter = {}
  let options = {
    limit,
    offset: limit * (page - 1)
  }
  
  let docs = await coll.find(filter, options).toArray()
  ctx.body = { docs }
})


// error-handling
// https://github.com/koajs/koa/blob/master/docs/error-handling.md
// app.use(async (ctx, next) => {
//   try {
//     await next()
//     throw new Error('123')
//   } catch (err) {
//     err.expose = true
//     // throw err
//     ctx.body = err.stack
//   }
// })

app.use(async (ctx, next) => {
  let start = Date.now()
  await next()
  let end = Date.now()
  let took = end - start
  console.log(`${ctx.method} ${ctx.url} - ${took}ms`)
})

app.use(apiRouter.routes())
app.use(apiRouter.allowedMethods())

module.exports = app
