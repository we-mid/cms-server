let { USERS, ORDERS } = require('../const')
let { getColl, toFieldsObj } = require('../db')
let { parsePagination } = require('./util')
let _ = require('lodash')

exports.registerResource = registerResource

function registerResource (router) {
  // dont forget to `parseInt` the number params
  router.get(`/${ORDERS}/list`, async ctx => {
    let fieldKeys = ['uid', 'user', 'sum', 'product', 'createdAt']
    let fields = toFieldsObj(fieldKeys)
    let { skip, limit, sort } = parsePagination(ctx)
    let options = { skip, limit, sort, fields }
    let filter = { deletedAt: null }

    let coll = await getColl(ORDERS)
    let [total, docs] = await Promise.all([
      coll.count(filter),
      coll.find(filter, options).toArray()
    ])
    ctx.body = { total, docs, refs }
  })
}
