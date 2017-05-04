let {
  USERS, ORDERS, CATEGORIES, PROVIDERS, PRODUCTS
} = require('../src/const')
let { getColl, closeDb } = require('../src/db')

unist()

async function unist () {
  // unist categories collection
  let coll = await getColl(CATEGORIES)
  await coll.deleteMany({})

  // unist providers collection
  coll = await getColl(PROVIDERS)
  await coll.deleteMany({})

  // unist products collection
  coll = await getColl(PRODUCTS)
  await coll.deleteMany({})

  // unist users collection
  coll = await getColl(USERS)
  await coll.deleteMany({})

  // unist orders collection
  coll = await getColl(ORDERS)
  await coll.deleteMany({})

  await closeDb()
}
