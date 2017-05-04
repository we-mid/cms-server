let { USERS, ORDERS, PRODUCTS } = require('../const')
let { getColl, toFieldsObj } = require('../db')
let { parsePagination } = require('./util')
let _ = require('lodash')

exports.registerResource = registerResource

function registerResource (router) {
  // dont forget to `parseInt` the number params
  router.get(`/${ORDERS}/list`, async ctx => {
    let fieldKeys = ['uid', 'product', 'amount', 'sum', 'user', 'address', 'createdAt']
    let fields = toFieldsObj(fieldKeys)
    let { skip, limit, sort } = parsePagination(ctx)
    let options = { skip, limit, sort, fields }
    let filter = { deletedAt: null }

    let coll = await getColl(ORDERS)
    let [total, docs] = await Promise.all([
      coll.count(filter),
      coll.find(filter, options).toArray()
    ])


    let relation = {
      user: {
        resource: USERS,
        show: ['uid', 'ad']
      },
      product: {
        resource: PRODUCTS,
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
      return { r: target.resource, ds }
    })
    let rs = await Promise.all(ps)
    let refs = rs.reduce((acc, { r, ds }) => {
      acc[r] = ds
      return acc
    }, {})

    ctx.body = { total, docs, refs }
  })
}
