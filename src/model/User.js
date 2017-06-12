let B = require('./Base')
let _ = require('lodash')

let C = class User extends B {

}

let CLIENT = 1
let ADMIN = 5
let PROVIDER = 8

let RoleProp = {
  type: Number,
  enum: [CLIENT, ADMIN, PROVIDER] // todo
}

C.schema = _.assign({}, B.schema, {
  name: { type: String },
  roles: { type: Array, element: RoleProp },
  ad: { type: String, optional: true },
  account: { type: String, optional: true },
  password: { type: String, optional: true }
})

C.secretFields = ['password']

module.exports = C
