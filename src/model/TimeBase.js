let B = require('./MongoBase')
let _ = require('lodash')

let C = class TimeBase extends B {
  // 可指定createdAt
  static async insert ({ many, data }) {
    let createdAt = new Date()
    if (many) {
      data = data.map(d => {
        return _.defaults(d, { createdAt })
      })
    } else {
      data = _.defaults(data, { createdAt })
    }
    return super.insert({ many, data })
  }

  // 可指定updatedAt
  static async update ({ many, filter, replace, set, unset }) {
    let updatedAt = new Date()
    set = set || {}
    set = _.defaults(set, { updatedAt })
    return super.update({ many, filter, replace, set, unset })
  }

  // 可指定deletedAt
  static async delete ({ many, filter, deletedAt }) {
    deletedAt = deletedAt || new Date()
    let set = { deletedAt }
    return this.update({ many, filter, set })
  }
}

let bSchemaCopy = _.clone(B.schema)
C.schema = _.assign(bSchemaCopy, {
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = C
