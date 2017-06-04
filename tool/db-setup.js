let {
  USERS, ORDERS, CATEGORIES, PROVIDERS, PRODUCTS
} = require('../src/const')
let { User } = require('../src/model')
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

  // setup products collection
  coll = await getColl(PRODUCTS)
  coll.createIndex({ uid: 1 }, { unique: true })
  coll.createIndex({ name: 1 }, { unique: true })
  let count = 0
  docs = [
    // todo: make `category` an array list
    { uid: `${++count}`, provider: 'jyj', category: 'lc', name: '特制鸡块饭', price: 25 },
    { uid: `${++count}`, provider: 'mdw', category: 'bf', name: '小笼包', price: 18 },
    { uid: `${++count}`, provider: 'ksf', category: 'bf', name: '芝士蛋糕', price: 22 }
  ]
  docs = docs.map(wrapDoc)
  await coll.insertMany(docs)

  // setup users collection
  coll = await getColl(USERS)
  coll.ensureIndex({ uid: 1 }, { unique: true })
  coll.ensureIndex({ ad: 1 }, { unique: true })
  await User.insert({ many: true, data: mockData.User })

  // setup orders collection
  coll = await getColl(ORDERS)
  coll.createIndex({ uid: 1 }, { unique: true })
  count = 0
  docs = [
    { uid: `${++count}`, product: '3', amount: 2, sum: 44, user: '2', address: '中兴西座 15F' },
    { uid: `${++count}`, product: '2', amount: 3, sum: 54, user: '3', address: '康佳研发 21F' }
  ]
  docs = docs.map(wrapDoc)
  await coll.insertMany(docs)

  await closeDb()
}

function wrapDoc (doc) {
  let createdAt = Date.now()
  return Object.assign({ createdAt }, doc)
}
