let { User } = require('../model')
let R = User.getResName()
let listFields = ['uid', 'ad', 'name', 'roles', 'createdAt']

exports.registerResource = registerResource
function registerResource (router) {
  // dont forget to `parseInt` the number params
  router.get(`/a/${R}/list`, async ctx => {
    let { pagin } = ctx.state
    let { total, docs } = await User.list({
      pagin,
      fields: listFields,
      filter: {}
    })
    ctx.body = { total, docs }
  })
}
