require('../src/proc')
let { User, Order, Product } = require('../src/model')

unist()

async function unist () {
  await Product.dangerouslyDrop()
  await User.dangerouslyDrop()
  await Order.dangerouslyDrop()

  await User.closeDb()
}
