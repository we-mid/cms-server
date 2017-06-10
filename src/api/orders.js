let { Order } = require('../model')
let R = Order.getResName()

let listFields = ['uid', 'product', 'amount', 'sum', 'user', 'address', 'createdAt']

exports.registerResource = registerResource
function registerResource (router) {
  // dont forget to `parseInt` the number params
  router.get(`/a/${R}/list`, async ctx => {
    let { pagin } = ctx.state
    let relation = {
      user: { fields: ['uid', 'ad'] },
      product: { fields: ['uid', 'name'] }
    }
    let { total, docs, refs } = await Order.list({
      pagin,
      relation,
      fields: listFields,
      filter: {}
    })
    ctx.body = { total, docs, refs }
  })
}
