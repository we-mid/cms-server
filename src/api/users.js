let { USERS } = require('../const')
let { User } = require('../model')
let { listBy } = require('../dao')
let { parsePagination } = require('./util')

exports.registerResource = registerResource

let R = USERS

function registerResource (router) {
  // dont forget to `parseInt` the number params
  router.get(`/a/${R}/list`, async ctx => {
    let { pagin } = ctx.state
    let { total, docs } = await User.paginate({
      pagin,
      fields: ['uid', 'ad', 'name', 'roles', 'createdAt'],
      filter: {}
    })
    ctx.body = { total, docs }
  })
}
