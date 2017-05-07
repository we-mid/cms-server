let { PRODUCTS } = require('../const')
let { getColl, toFieldsObj, genDocUid } = require('../db')
let { koaJson, parsePagination } = require('./util')
let _ = require('lodash')

exports.registerResource = registerResource

function registerResource (router) {
  router.post(`/${PRODUCTS}/create`, koaJson, async ctx => {
    let editFields = ['name', 'description',, 'provider', 'category', 'price']
    let doc = _.pick(ctx.request.body, editFields)
    doc.uid = genDocUid()
    doc.createdAt = Date.now()

    let coll = await getColl(PRODUCTS)
    let ret = await coll.insertOne(doc)
    ctx.body = { ret }
  })

  router.post(`/${PRODUCTS}/update`, koaJson, async ctx => {
    let editFields = ['name', 'description', 'provider', 'category', 'price']
    let mutation = _.pick(ctx.request.body, editFields)
    mutation.updatedAt = Date.now()

    let { uid, uids } = ctx.request.body
    let update = { $set: mutation }
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

  router.post(`/${PRODUCTS}/delete`, koaJson, async ctx => {
    let { uid, uids } = ctx.request.body
    let mutation = { deletedAt: Date.now() }
    let update = { $set: mutation }
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
  router.get(`/${PRODUCTS}/list`, async ctx => {
    let fieldKeys = ['uid', 'name', 'description', 'provider', 'category', 'price', 'createdAt']
    let fields = toFieldsObj(fieldKeys)
    let { skip, limit, sort } = parsePagination(ctx)
    let options = { skip, limit, sort, fields }
    let filter = { deletedAt: null }

    let coll = await getColl(PRODUCTS)
    let [total, docs] = await Promise.all([
      coll.count(filter),
      coll.find(filter, options).toArray()
    ])
    ctx.body = { total, docs }
  })
}
