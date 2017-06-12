let B = require('./Base')
let _ = require('lodash')

let C = class Product extends B {

}

let priceProp = { type: Number, range: [0.5, 99.5], step: 0.5 }
C.priceProp = priceProp

C.schema = _.assign({}, B.schema, {
  price: priceProp,
  name: { type: String, range: [2, 16] },
  category: { type: String },
  provider: { type: String, default: 'ksf' },
  description: { type: String, range: [0, 32], default: '' }
})

module.exports = C
