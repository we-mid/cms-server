let Product = require('./Product')
let User = require('./User')
let B = require('./Base')
let _ = require('lodash')

let C = class Order extends B {

}

let bSchemaCopy = _.clone(B.schema)
C.schema = _.assign(bSchemaCopy, {
  product: Product.uidProp,
  // price: Product.priceProp,
  amount: { type: Number, range: [1, 99], step: 1 },
  sum: { type: Number, range: [0, null] },
  user: User.uidProp,
  address: { type: String }
})

module.exports = C
