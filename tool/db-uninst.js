let {
  ORDERS, CATEGORIES, PROVIDERS
} = require('../src/const')
let { User, Product } = require('../src/model')
let { getColl, closeDb } = require('../src/db')

unist()

async function unist () {
  let coll = await getColl(CATEGORIES)
  await coll.deleteMany({})

  coll = await getColl(PROVIDERS)
  await coll.deleteMany({})

  coll = await getColl(ORDERS)
  await coll.deleteMany({})

  await Product.dangerouslyDrop()
  await User.dangerouslyDrop()

  await closeDb()
}
