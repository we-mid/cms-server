let { getColl, closeDb } = require('../src/db')
let { USERS, CATEGORIES, PROVIDERS, PRODUCTS } = require('../src/const')

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

  await closeDb()
}
