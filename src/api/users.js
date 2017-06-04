let { User } = require('../model')

let R = User.getResName()

exports.registerResource = registerResource

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
