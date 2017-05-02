let { PRODUCTS, PROVIDERS, CATEGORIES } = require('../const')
let { getColl, toFieldsObj } = require('../db')
let uuid = require('uuid')
let _ = require('lodash')

exports.registerResource = registerResource

function registerResource (router) {
  router.post(`/${PRODUCTS}/create`, async ctx => {
    let editFields = ['name', 'provider', 'category', 'description']
    let doc = _.pick(ctx.request.body, editFields)
    doc.uid = uuid()
    doc.createdAt = Date.now()

    let coll = await getColl(PRODUCTS)
    let ret = await coll.insertOne(doc)
    ctx.body = { ret }
  })

  router.post(`/${PRODUCTS}/update`, async ctx => {
    let editFields = ['name', 'provider', 'category', 'description']
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

  router.post(`/${PRODUCTS}/delete`, async ctx => {
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
    let fieldKeys = ['uid', 'name', 'provider', 'category', 'description']
    let fields = toFieldsObj(fieldKeys)
    let { skip, limit, sort } = parsePagination(ctx)
    let options = { skip, limit, sort, fields }
    let filter = { deletedAt: null }

    let coll = await getColl(PRODUCTS)
    let [total, docs] = await Promise.all([
      coll.count(filter),
      coll.find(filter, options).toArray()
    ])

    let relation = {
      category: {
        resource: CATEGORIES,
        show: ['uid', 'name']
      },
      provider: {
        resource: PROVIDERS,
        show: ['uid', 'name']
      }
    }
    // fixme: make a util function
    let arr = _.map(relation, (target, k) =>({ k, target }))
    let ps = arr.map(async ({ k, target }) => {
      let uids = _.uniq(_.map(docs, k))
      let coll = await getColl(target.resource)
      let ds = await coll.find({
        // `{ deletedAt: null }` matches documents that either contain the item field whose
        // value is null or that do not contain the item field.
        // https://docs.mongodb.com/manual/tutorial/query-for-null-fields/#faq-developers-query-for-nulls
        deletedAt: null,
        uid: { $in: uids }
      }, {
        fields: toFieldsObj(target.show)
      }).toArray()
      return { k, ds }
    })
    let rs = await Promise.all(ps)
    let refs = rs.reduce((acc, { k, ds }) => {
      acc[k] = ds
      return acc
    }, {})

    ctx.body = { total, docs, refs }
  })
}

function parsePagination (ctx) {
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
  return { skip, limit, sort }
}
