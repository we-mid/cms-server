let B = require('./MongoBase')
let _ = require('lodash')

let C = class TimeBase extends B {
  // 可指定createdAt
  static async insert ({ doc, docs }) {
    let createdAt = new Date()
    if (docs) {
      docs = docs.map(d => {
        return _.defaults({}, d, { createdAt })
      })
    } else {
      doc = _.defaults({}, doc, { createdAt })
    }
    return super.insert({ doc, docs })
  }

  static async find ({ one, filter, fields, sort, skip, limit }) {
    filter = this._fixFilter(filter)
    return super.find({ one, filter, fields, sort, skip, limit })
  }

  // 可指定updatedAt
  static async update ({ many, filter, set }) {
    filter = this._fixFilter(filter)
    let updatedAt = new Date()
    set = set || {}
    set = _.defaults({}, set, { updatedAt })
    return super.update({ many, filter, set })
  }

  // 可指定deletedAt
  static async delete ({ many, filter, deletedAt }) {
    filter = this._fixFilter(filter)
    deletedAt = deletedAt || new Date()
    let set = { deletedAt }
    return this.update({ many, filter, set })
  }

  static _fixFilter (filter) {
    let { defaultFilter } = this
    return _.defaults({}, filter, defaultFilter)
  }
}

let bSchemaCopy = _.clone(B.schema)
C.schema = _.assign(bSchemaCopy, {
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})
C.defaultFilter = {
  deletedAt: null // 所有操作都基于未"删除"的对象
}

module.exports = C
