require('../src/env')
let {
  CATEGORIES, PROVIDERS
} = require('../src/const')
let { User, Order, Product } = require('../src/model')
let { getColl, closeDb } = require('../src/db')
let mockData = require('../test/_mockData')

setup()

async function setup () {
  // setup categories collection
  let coll = await getColl(CATEGORIES)
  coll.createIndex({ uid: 1 }, { unique: true })
  coll.createIndex({ name: 1 }, { unique: true })
  let docs = [
    { type: 'period', uid: 'bf', name: '早餐' },
    { type: 'period', uid: 'lc', name: '午餐' },
    { type: 'period', uid: 'sp', name: '晚餐' }
  ]
  docs = docs.map(wrapDoc)
  await coll.insertMany(docs)

  // setup providers collection
  coll = await getColl(PROVIDERS)
  coll.createIndex({ uid: 1 }, { unique: true })
  coll.createIndex({ name: 1 }, { unique: true })
  docs = [
    { uid: 'mdw', name: '面点王' },
    { uid: 'ksf', name: '可颂坊' },
    { uid: 'jyj', name: '吉野家' }
  ]
  docs = docs.map(wrapDoc)
  await coll.insertMany(docs)

  await Product.index({ uid: 1 }, { unique: true })
  await Product.index({ name: 1 }, { unique: true })
  await Product.insert({ docs: mockData.Product })

  await User.index({ uid: 1 }, { unique: true })
  await User.index({ ad: 1 }, { unique: true })
  await User.insert({ docs: mockData.User })

  await Order.index({ uid: 1 }, { unique: true })
  await Order.insert({ docs: mockData.Order })

  await closeDb()
  await User.closeDb()
}

function wrapDoc (doc) {
  let createdAt = Date.now()
  return Object.assign({ createdAt }, doc)
}
