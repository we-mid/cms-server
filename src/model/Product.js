let B = require('./Base')
let _ = require('lodash')

let C = class Product extends B {

}

let bSchemaCopy = _.clone(B.schema)
C.schema = _.assign(bSchemaCopy, {
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  provider: { type: String, default: 'ksf' },
  description: { type: String }
})

module.exports = C
