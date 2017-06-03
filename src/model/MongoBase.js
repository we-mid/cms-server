let { ObjectID } = require('mongodb')
let { getColl } = require('../db')
let { toFieldsObj } = require('../../util')
let B = require('./SchemaBase')

let C = class MongoBase extends B {
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

  static async count ({ filter, skip, limit }) {
    let coll = await this.getColl()
    return coll.count(filter, { skip, limit })
  }

  // 为了数据安全 remove为高危方法 添加dangerously语义
  // 日常使用delete 修改状态
  static async dangerouslyDelete ({ many, filter }) {
    let coll = await this.getColl()
    let method = many ? 'deleteMany' : 'deleteOne'
    let ret = await coll[method](filter)
    return ret
  }

  static async insert ({ many, data }) {
    let coll = await this.getColl()
    let method
    let prune = d => {
      return this.prune({ data: d, exclude: ['_id'] })
    }

    if (many) {
      method = 'insertMany'
      data = data.map(prune)
    } else {
      method = 'insertOne'
      data = prune(data)
    }
    let ret = await coll[method](data)
    return ret
  }

  // 暂时只支持 $set操作符
  // $unset的validate环节 负担太重 暂不支持
  static async update ({ many, filter, set }) {
    let coll = await this.getColl()
    set = this.prune({ data: set, partial: true })

    let update = { $set: set }
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
