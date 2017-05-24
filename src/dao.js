let { getColl } = require('./db')
let access = require('object-access')
let uuid = require('uuid')
let _ = require('lodash')

exports.toFieldsObj = toFieldsObj
exports.genDocUid = genDocUid
exports.createBy = createBy
exports.deleteBy = deleteBy
exports.updateBy = updateBy
exports.listBy = listBy
exports.findBy = findBy

let defaultFilter = { deletedAt: null }

async function findBy (resource, { filter, fields, relation, pagination }) {
  pagination = pagination || {}
  pagination.limit = 1
  let { docs, refs } = await listBy(resource, { filter, fields, relation, pagination })
  let doc = docs[0] || null
  return { doc, refs }
}

async function listBy (resource, { filter, fields, relation, pagination }) {
  fields = toFieldsObj(fields)
  filter = _.defaults(filter, defaultFilter) // avoiding mutation
  let { sort, skip, limit } = pagination
  let options = { sort, skip, limit, fields }

  let coll = await getColl(resource)
  let [total, docs] = await Promise.all([
    coll.count(filter),
    coll.find(filter, options).toArray()
  ])
  let ret = { total, docs }

  if (relation) {
    ret.refs = await popRelation(docs, relation)
  }
  return ret
}

async function popRelation (docs, relation) {
  let arr = _.map(relation, (target, k) => ({ k, target }))
  let ps = arr.map(async ({ k, target }) => {
    let uids = _.map(docs, d => {
      return access(d, k)
    })
    uids = _.compact(uids)
    uids = _.uniq(uids)
    let coll = await getColl(target.link)
    let ds = await coll.find({
      // `{ deletedAt: null }` matches documents that either contain the item field whose
      // value is null or that do not contain the item field.
      // https://docs.mongodb.com/manual/tutorial/query-for-null-fields/#faq-developers-query-for-nulls
      deletedAt: null,
      uid: { $in: uids }
    }, {
      fields: toFieldsObj(target.show)
    }).toArray()
    return { r: target.link, ds }
  })
  let rs = await Promise.all(ps)
  let refs = rs.reduce((acc, { r, ds }) => {
    acc[r] = ds
    return acc
  }, {})
  return refs
}

async function updateBy (resource, { uid, uids }, mutation) {
  mutation = _.clone(mutation) // avoid mutation
  mutation.updatedAt = Date.now()
  let update = { $set: mutation }
  let coll = await getColl(resource)
  let ret

  if (uid) {
    let filter = { uid }
    ret = await coll.updateOne(filter, update)
  } else if (uids) {
    let filter = { uid: { $in: uids } }
    ret = await coll.updateMany(filter, update)
  } else {
    throw new Error('either of uid or uids is required')
  }
  return ret
}

// todo: deleteBy + deleteByUid
async function deleteBy (resource, { uid, uids }) {
  let mutation = { deletedAt: Date.now() }
  let update = { $set: mutation }
  let coll = await getColl(resource)
  let ret

  if (uid) {
    let filter = { uid }
    ret = await coll.updateOne(filter, update)
  } else if (uids) {
    let filter = { uid: { $in: uids } }
    ret = await coll.updateMany(filter, update)
  } else {
    throw new Error('either of uid or uids is required')
  }
  return ret
}

async function createBy (resource, doc) {
  doc = _.clone(doc) // avoiding mutation
  doc.uid = genDocUid()
  doc.createdAt = Date.now()

  let coll = await getColl(resource)
  let ret = await coll.insertOne(doc)
  return ret
}

// 8-bits is enough, (10+26)**8 = 2,821,109,907,456
function genDocUid () {
  return uuid().substr(0, 8)
}

function toFieldsObj (keys) {
  let obj = keys.reduce((acc, k) => {
    acc[k] = 1
    return acc
  }, {})
  obj._id = 0 // always exclude annoying `_id`
  return obj
}
