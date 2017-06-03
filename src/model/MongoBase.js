let { validate } = require('schema-validator2')
let { ObjectID } = require('mongodb')
let { getColl } = require('../db')
let { toFieldsObj } = require('../../util')

let C = class MongoBase {
  // 验证data是否符合schema 通过则返回空 不通过则返回原因
  // partial为true表明局部验证 默认为整体验证
  static validate ({ data, partial }) {
    let { schema } = this
    return validate({ schema, data, partial })
  }

  static async find ({ one, filter, fields, sort, skip, limit }) {
    let coll = await this.getColl()
    let method = one ? 'findOne' : 'find'
    fields = toFieldsObj(fields)
    let promise = coll[method](filter, {
      fields, sort, skip, limit
    })
    if (!one) {
      promise = promise.toArray()
    }
    return promise
  }

  static async insert ({ many, data }) {
    let coll = await this.getColl()
    let method = many ? 'insertMany' : 'insertOne'
    let ret = await coll[method](data)
    return ret
  }

  // 为了数据安全 remove为高危方法 添加dangerously语义
  // 日常使用delete 修改状态
  static async dangerouslyDelete ({ many, filter }) {
    let coll = await this.getColl()
    let method = many ? 'deleteMany' : 'deleteOne'
    let ret = await coll[method](filter)
    return ret
  }

  static async update ({ many, filter, replace, set, unset }) {
    let coll = await this.getColl()
    let update
    if (replace) {
      update = replace
    } else {
      update = {}
      if (set) update.$set = set
      if (unset) update.$unset = unset
    }
    let method = many ? 'updateMany' : 'updateOne'
    let ret = await coll[method](filter, update)
    return ret
  }

  static async getColl () {
    return getColl(this.name)
  }
}

C.schema = {
  _id: { type: ObjectID, required: true }
}

module.exports = C
