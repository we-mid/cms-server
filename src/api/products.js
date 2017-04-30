let { PRODUCTS } = require('../const')
let { getColl } = require('../db')
let uuid = require('uuid')

exports.registerResource = registerResource

function registerResource (router) {
  router.post(`/${PRODUCTS}/create`, async ctx => {
    let { name, provider, category, description } = ctx.request.body
    let uid = uuid()
    let createdAt = Date.now()
    let doc = { uid, name, description, provider, category, createdAt }
    let coll = await getColl(PRODUCTS)
    let ret = await coll.insertOne(doc)
    ctx.body = { ret }
  })

  router.post(`/${PRODUCTS}/update`, async ctx => {
    let { uid, uids } = ctx.request.body
    let { name, description } = ctx.request.body
    let update = { $set: { name, description } }
    let coll = await getColl(PRODUCTS)
    let ret

    if (uid) {
      let filter = { uid }
      ret = await coll.updateOne(filter, update)
    } else if (uids) {
      let filter = { uid: { $in: uids } }
      ret = await coll.updateMany(filter, update)
    } else {
      throw new Error('either of uid or uids is required')
    }
    ctx.body = { ret }
  })

  router.post(`/${PRODUCTS}/delete`, async ctx => {
    let { uid, uids } = ctx.request.body
    let update = { $set: { deletedAt: Date.now() } }
    let coll = await getColl(PRODUCTS)
    let ret
    if (uid) {
      let filter = { uid }
      ret = await coll.updateOne(filter, update)
    } else if (uids) {
      let filter = { uid: { $in: uids } }
      ret = await coll.updateMany(filter, update)
    } else {
      throw new Error('either of uid or uids is required')
    }
    ctx.body = { ret }
  })

  // dont forget to `parseInt` the number params
  router.get(`/${PRODUCTS}/list`, async (ctx, next) => {
    let filter = {
      deletedAt: null
    }
    let options = {
      fields: ['uid', 'name', 'provider', 'category', 'description']
    }
    ctx.state.listFilter = filter
    ctx.state.listOptions = options
    await next()
  })
}
