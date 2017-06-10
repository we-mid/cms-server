let Product = require('./Product')
let User = require('./User')
let B = require('./Base')
let _ = require('lodash')

let C = class Order extends B {

}

let sumProp = _.assign({}, Product.priceProp, { range: [0, null] })

let bSchemaCopy = _.clone(B.schema)
C.schema = _.assign(bSchemaCopy, {
  product: { ref: Product },
  amount: { type: Number, range: [1, 99], step: 1 },
  sum: sumProp,
  user: { ref: User },
  address: { type: String }
})

module.exports = C
