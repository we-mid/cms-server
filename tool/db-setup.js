require('../src/proc')
let { User, Order, Product } = require('../src/model')
let mockData = require('../test/_mockData')

setup().catch(err => {
  console.error(err.stack)
})

async function setup () {
  await Product.index({ uid: 1 }, { unique: true })
  await Product.index({ name: 1 }, { unique: true })
  await Product.insert({ docs: mockData.Product })

  await User.index({ uid: 1 }, { unique: true })
  await User.index({ ad: 1 }, { unique: true })
  await User.insert({ docs: mockData.User })

  await Order.index({ uid: 1 }, { unique: true })
  await Order.insert({ docs: mockData.Order })

  await User.closeDb()
}
