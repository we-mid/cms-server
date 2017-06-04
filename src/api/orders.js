let { Order } = require('../model')
let { USERS, ORDERS: R, PRODUCTS } = require('../const')
let { listBy } = require('../dao')
let { parsePagination } = require('./util')

let listFields = ['uid', 'product', 'amount', 'sum', 'user', 'address', 'createdAt']

exports.registerResource = registerResource
function registerResource (router) {
  // dont forget to `parseInt` the number params
  router.get(`/a/${R}/list`, async ctx => {
    // let pagination = parsePagination(ctx)
    // let filter = {}

    // let relation = {
    //   user: {
    //     link: USERS,
    //     show: ['uid', 'ad']
    //   },
    //   product: {
    //     link: PRODUCTS,
    //     show: ['uid', 'name']
    //   }
    // }

    // let { total, docs, refs } = await listBy(R, {
    //   filter, fields, relation, pagination
    // })
    // ctx.body = { total, docs, refs }

    // fixme: relation populate
    let { pagin } = ctx.state
    let { total, docs } = await Order.list({
      pagin,
      fields: listFields,
      filter: {}
    })
    ctx.body = { total, docs }
  })
}
