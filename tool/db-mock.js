let { init, onError } = require('../src/proc')
let { User, Order, Product } = require('../src/model')
let mockData = require('../test/_mockData')

init('db-mock')
main().catch(onError)

async function main () {
  for (let Model of [User, Product, Order]) {
    let collName = Model.getCollName()
    let docs = mockData[collName]
    await Model.insert({ docs })
  }
  await User.closeDb()
}
