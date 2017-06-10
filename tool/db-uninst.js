let { init } = require('../src/proc')
let { User, Order, Product } = require('../src/model')

init('db-uninst')
unist()

async function unist () {
  await Product.dangerouslyDrop()
  await User.dangerouslyDrop()
  await Order.dangerouslyDrop()

  await User.closeDb()
}
