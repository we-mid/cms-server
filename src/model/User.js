let B = require('./Base')
let _ = require('lodash')

let C = class User extends B {

}

let CLIENT = 1
let ADMIN = 5
let PROVIDER = 8

let RoleProp = {
  required: true,
  type: Number,
  enum: [CLIENT, ADMIN, PROVIDER] // todo
}

let bSchemaCopy = _.clone(B.schema)
C.schema = _.assign(bSchemaCopy, {
  name: { type: String, required: true },
  roles: { type: Array, element: RoleProp, required: true },
  ad: { type: String },
  account: { type: String },
  password: { type: String }
})
C.secretFields = ['password']

module.exports = C
