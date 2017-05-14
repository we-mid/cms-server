let { USERS } = require('../const')
let { listBy } = require('../dao')
let { parsePagination } = require('./util')

exports.registerResource = registerResource

let R = USERS

function registerResource (router) {
  // dont forget to `parseInt` the number params
  router.get(`/${R}/list`, async ctx => {
    let fields = ['uid', 'ad', 'name', 'createdAt']
    let pagination = parsePagination(ctx)
    let filter = {}
    let { total, docs } = await listBy(R, {
      filter, fields, pagination
    })
    ctx.body = { total, docs }
  })
}
