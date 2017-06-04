let { User } = require('../src/model')
let { useMockDb } = require('./_mockDb')
let { ObjectID } = require('mongodb')
let { test } = require('ava')
let _ = require('lodash')

test.before(() => {
  useMockDb(User)
})
test.after(() => {
  User.restoreMockDb()
})

test.serial('find many', async t => {
  let docs = await User.find({
    fields: ['uid', 'name'],
    filter: {}
  })
  t.is(docs.length, 5)
})

test.serial('find one', async t => {
  let filter = { uid: '2' }
  let _doc = _.find(User._mockData, filter)
  t.truthy(_doc._id)

  let doc = await User.find({
    one: true,
    fields: ['uid', 'name'],
    filter
  })
  t.falsy(doc._id)
  t.truthy(doc.name)
})

test.serial('password为机密字段 filter查询应报错', async t => {
  let filter = { account: 'admin' }
  let _doc = _.find(User._mockData, filter)
  t.truthy(_doc.password)

  let promise = (async () => {
    await User.find({
      one: true,
      fields: ['uid', 'name', 'password'],
      filter: {}
    })
  })()
  let err = await t.throws(promise)
  t.regex(err.message, /机密/)
})

test.serial('insert one', async t => {
  t.is(User._mockData.length, 5)

  let ret = await User.insert({
    data: { roles: [1], ad: 'grace.fan', name: 'Fan-fan' }
  })
  t.is(ret.insertedCount, 1)
  t.is(ret.insertedIds.length, 1)
  t.is(ret.ops.length, 1)
  t.is(ret.ops[0].ad, 'grace.fan')

  let opId = ret.ops[0]._id
  t.truthy(opId instanceof ObjectID)
  t.truthy(opId.equals(ret.insertedIds[0]))
  t.is(User._mockData.length, 6)
})

test.serial('insert one with invalid _id', async t => {
  let promise = User.insert({
    data: { _id: 123, roles: [1], ad: 'grace.fan', name: 'Fan-fan' }
  })
  let err = await t.throws(promise)
  t.regex(err.message, /is not a/)
})

test.serial('insert many', async t => {
  t.is(User._mockData.length, 6)

  let ret = await User.insert({
    many: true,
    data: _.times(3, () => {
      return { roles: [1], ad: 'grace.fan', name: 'Fan-fan' }
    })
  })
  t.is(ret.insertedCount, 3)
  t.is(ret.insertedIds.length, 3)
  t.is(ret.ops.length, 3)

  let arr1 = _.map(ret.ops, '_id').sort()
  let arr2 = ret.insertedIds.sort()
  t.deepEqual(arr1, arr2)
  t.is(User._mockData.length, 9)
})

test.serial('update one', async t => {
  let ret = await User.update({
    filter: { ad: 'nesger.guo' },
    set: { name: 'Unicorn' }
  })
  t.is(ret.matchedCount, 1)
  t.is(ret.modifiedCount, 1)

  let doc = await User.find({
    one: true,
    filter: { ad: 'nesger.guo' },
    fields: ['name']
  })
  t.is(doc.name, 'Unicorn')
})

test.serial('update many', async t => {
  let count = 4 // 前面insert的总数
  let ret = await User.update({
    many: true,
    filter: { ad: 'grace.fan' },
    set: { name: '2333' }
  })
  t.is(ret.matchedCount, count)
  t.is(ret.modifiedCount, count)

  let docs = await User.find({
    filter: { ad: 'grace.fan' },
    fields: ['name']
  })
  let expected = _.times(count, () => ({ name: '2333' }))
  t.deepEqual(docs, expected)
})

test.serial('delete one', async t => {
  let ret = await User.delete({
    filter: { ad: 'nesger.guo' }
  })
  t.is(ret.matchedCount, 1)
  t.is(ret.modifiedCount, 1)

  let doc = await User.find({
    one: true,
    filter: { ad: 'nesger.guo' },
    fields: ['name']
  })
  t.is(doc, null)
})

test.serial('delete many', async t => {
  let ret = await User.delete({
    many: true,
    filter: { ad: 'grace.fan' }
  })
  t.is(ret.matchedCount, 4) // 前面insert的总数
  t.is(ret.modifiedCount, 4)

  let docs = await User.find({
    many: true,
    filter: { ad: 'grace.fan' },
    fields: ['name']
  })
  t.is(docs.length, 0)
})
