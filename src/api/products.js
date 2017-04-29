let { PRODUCTS } = require('../const')
let { getColl } = require('../db')

exports.registerResource = registerResource

function registerResource (router) {
  router.post(`/${PRODUCTS}/create`, async ctx => {
    let { title, description } = ctx.request.body
    let doc = { title, description }
    let coll = await getColl(PRODUCTS)
    let ret = await coll.insertOne(doc)
    ctx.body = { ret }
  })

  router.post(`/${PRODUCTS}/update`, async ctx => {
    let { _id, _ids } = ctx.request.body
    let { title, description } = ctx.request.body
    let update = { $set: { title, description } }
    let coll = await getColl(PRODUCTS)
    let ret

    if (_id) {
      let filter = { _id }
      ret = await coll.updateOne(filter, update)
    } else if (_ids) {
      let filter = { _id: { $in: _ids } }
      ret = await coll.updateMany(filter, update)
    } else {
      throw new Error('either of _id or _ids is required')
    }
    ctx.body = { ret }
  })

  router.post(`/${PRODUCTS}/delete`, async ctx => {
    let { _id, _ids } = ctx.request.body
    let coll = await getColl(PRODUCTS)
    let ret

    if (_id) {
      let filter = { _id }
      ret = await coll.deleteOne(filter)
    } else if (_ids) {
      let filter = { _id: { $in: _ids } }
      ret = await coll.deleteMany(filter)
    } else {
      throw new Error('either of _id or _ids is required')
    }
    ctx.body = { ret }
  })

  // dont forget to `parseInt` the number params
  router.get(`/${PRODUCTS}/list`, async (ctx, next) => {
    let filter = {} // todo
    ctx.state.listFilter = filter
    await next()
  })
}
