let { Product } = require('../model')
let { PRODUCTS: R } = require('../const')
let { koaJson } = require('./util')
let _ = require('lodash')

exports.registerResource = registerResource

let editFields = ['name', 'description', 'provider', 'category', 'price']
let listFields = [...editFields, 'uid', 'createdAt']

function registerResource (router) {
  router.post(`/a/${R}/create`, koaJson, async ctx => {
    let doc = _.pick(ctx.request.body, editFields)
    let { result } = await Product.insert({ doc })
    ctx.body = { result }
  })

  router.post(`/a/${R}/update`, koaJson, async ctx => {
    let { uid } = ctx.request.body
    let set = _.pick(ctx.request.body, editFields)
    let { result } = await Product.update({
      filter: { uid }, set
    })
    ctx.body = { result }
  })

  router.post(`/a/${R}/delete`, koaJson, async ctx => {
    let { uid } = ctx.request.body
    let { result } = await Product.delete({
      filter: { uid }
    })
    ctx.body = { result }
  })

  // dont forget to `parseInt` the number params
  router.get(`/a/${R}/list`, async ctx => {
    let { total, docs } = await Product.paginate({
      pagin: ctx.state.pagin,
      fields: listFields,
      filter: {}
    })
    ctx.body = { total, docs }
  })
}
