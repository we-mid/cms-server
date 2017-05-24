let { USERS, ORDERS, PRODUCTS } = require('../const')
let { listBy } = require('../dao')
let { parsePagination } = require('./util')

exports.registerResource = registerResource

let R = ORDERS

function registerResource (router) {
  // dont forget to `parseInt` the number params
  router.get(`/a/${R}/list`, async ctx => {
    let fields = ['uid', 'product', 'amount', 'sum', 'user', 'address', 'createdAt']
    let pagination = parsePagination(ctx)
    let filter = {}

    let relation = {
      user: {
        link: USERS,
        show: ['uid', 'ad']
      },
      product: {
        link: PRODUCTS,
        show: ['uid', 'name']
      }
    }

    let { total, docs, refs } = await listBy(R, {
      filter, fields, relation, pagination
    })
    ctx.body = { total, docs, refs }
  })
}
