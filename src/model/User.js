let B = require('./Base')
let _ = require('lodash')

let C = class User extends B {

}

let CLIENT = 1
let ADMIN = 5
let PROVIDER = 8

let RoleProp = {
  type: Number,
  enum: [CLIENT, ADMIN, PROVIDER]
}

let bSchemaCopy = _.clone(B.schema)
C.schema = _.assign(bSchemaCopy, {
  uid: { type: String, required: true },
  name: { type: String, required: true },
  roles: { type: Array, element: RoleProp, required: true },
  account: { type: String },
  password: { type: String }
})
C.secretFields = ['password']

module.exports = C
