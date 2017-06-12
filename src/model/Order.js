let Product = require('./Product')
let User = require('./User')
let B = require('./Base')
let _ = require('lodash')

let C = class Order extends B {

}

let sumProp = _.assign({}, Product.priceProp, { range: [0, null] })

C.schema = _.assign({}, B.schema, {
  product: { ref: Product },
  amount: { type: Number, range: [1, 99], step: 1 },
  sum: sumProp,
  user: { ref: User },
  address: { type: String }
})

C.indexes = _.assign({}, B.indexes, {
  user_1: [{ user: 1 }]
})

module.exports = C
