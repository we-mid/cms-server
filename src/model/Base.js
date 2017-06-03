let B = require('./TimeBase')
let _ = require('lodash')

class C extends B {
  static async find ({ one, filter, fields, sort, skip, limit }) {
    if (!fields || !fields.length) {
      throw new Error('fields必须明确定义')
    }
    let sect = _.intersection(fields, this.secretFields)
    if (sect.length) {
      throw new Error(`其中${sect}为机密字段 不可直接返回`)
    }
    return super.find({ one, filter, fields, sort, skip, limit })
  }
}

C.secretFields = []

module.exports = C
