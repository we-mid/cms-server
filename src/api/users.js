let { USERS } = require('../const')
let { getColl, toFieldsObj } = require('../db')
let { parsePagination } = require('./util')

exports.registerResource = registerResource

function registerResource (router) {
  // dont forget to `parseInt` the number params
  router.get(`/${USERS}/list`, async ctx => {
    let fieldKeys = ['uid', 'ad', 'name', 'createdAt']
    let fields = toFieldsObj(fieldKeys)
    let { skip, limit, sort } = parsePagination(ctx)
    let options = { skip, limit, sort, fields }
    let filter = { deletedAt: null }

    let coll = await getColl(USERS)
    let [total, docs] = await Promise.all([
      coll.count(filter),
      coll.find(filter, options).toArray()
    ])

    ctx.body = { total, docs }
  })
}
