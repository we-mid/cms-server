let { getColl, closeDb } = require('../src/db')
let { CATEGORIES, PROVIDERS } = require('../src/const')

setup()

async function setup () {
  // setup categories collection
  let coll = await getColl(CATEGORIES)
  coll.createIndex({ uid: 1 }, { unique: true })
  coll.createIndex({ name: 1 }, { unique: true })
  let docs = [
    { type: 'period', uid: 'breakfast', name: '早餐' },
    { type: 'period', uid: 'lunch', name: '午餐' },
    { type: 'period', uid: 'supper', name: '晚餐' },
    { type: 'price', uid: '20y', name: '20元套餐' },
    { type: 'price', uid: '25y', name: '25元套餐' },
    { type: 'price', uid: '30y', name: '30元套餐' }
  ]
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
  await coll.insertMany(docs)

  await closeDb()
}
