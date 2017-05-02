let { getColl, closeDb } = require('../src/db')
let { CATEGORIES, PROVIDERS } = require('../src/const')

unist()

async function unist () {
  // unist categories collection
  let coll = await getColl(CATEGORIES)
  await coll.deleteMany({})

  // unist providers collection
  coll = await getColl(PROVIDERS)
  await coll.deleteMany({})

  await closeDb()
}
