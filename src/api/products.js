let { Product } = require('../model')
let { koaJson, strToRegex } = require('./util')
let _ = require('lodash')

let R = Product.getResName()
let editFields = ['name', 'description', 'provider', 'category', 'price']
let listFields = [...editFields, 'uid', 'createdAt']

exports.registerResource = registerResource
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
    let filter = {}
    let search = ctx.query.search || {}
    if (search.category != null) {
      filter.category = search.category
    }
    if (search.price != null) {
      filter.price = +search.price
    }
    if (search.keyword != null) {
      filter.$or = ['uid', 'name', 'description'].map(k => {
        return { [k]: strToRegex(search.keyword) }
      })
    }

    let { total, docs } = await Product.list({
      pagin: ctx.state.pagin,
      fields: listFields,
      filter
    })
    ctx.body = { total, docs }
  })
}
