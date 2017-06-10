let { init, onError } = require('../src/proc')
let { User, Order, Product } = require('../src/model')

init('db-uninst')
unist().catch(onError)

async function unist () {
  await Product.dangerouslyDrop()
  await User.dangerouslyDrop()
  await Order.dangerouslyDrop()

  await User.closeDb()
}
