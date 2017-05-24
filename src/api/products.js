let { PRODUCTS } = require('../const')
let { listBy, createBy, deleteBy, updateBy } = require('../dao')
let { koaJson, parsePagination } = require('./util')
let _ = require('lodash')

exports.registerResource = registerResource

let R = PRODUCTS

function registerResource (router) {
  router.post(`/a/${R}/create`, koaJson, async ctx => {
    let fields = ['name', 'description', 'provider', 'category', 'price']
    let doc = _.pick(ctx.request.body, fields)
    let ret = await createBy(R, doc)
    ctx.body = { ret }
  })

  router.post(`/a/${R}/update`, koaJson, async ctx => {
    let fields = ['name', 'description', 'provider', 'category', 'price']
    let mutation = _.pick(ctx.request.body, fields)
    let { uid, uids } = ctx.request.body
    let ret = await updateBy(R, { uid, uids }, mutation)
    ctx.body = { ret }
  })

  router.post(`/a/${R}/delete`, koaJson, async ctx => {
    let { uid, uids } = ctx.request.body
    let ret = await deleteBy(R, { uid, uids })
    ctx.body = { ret }
  })

  // dont forget to `parseInt` the number params
  router.get(`/a/${R}/list`, async ctx => {
    let fields = ['uid', 'name', 'description', 'provider', 'category', 'price', 'createdAt']
    let pagination = parsePagination(ctx)
    let filter = {}
    let { total, docs } = await listBy(R, {
      filter, fields, pagination
    })
    ctx.body = { total, docs }
  })
}
