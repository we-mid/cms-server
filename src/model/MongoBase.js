let { ObjectID } = require('mongodb')
let { getColl } = require('../db')
let { toFieldsObj } = require('../../util')
let B = require('./SchemaBase')
let _ = require('lodash')

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

  static async insert ({ doc, docs }) {
    let coll = await this.getColl()
    let method
    let prune = d => {
      // return this.prune({ data: d, exclude: ['_id'] })
      return this.prune({ data: d })
    }

    if (docs) {
      method = 'insertMany'
      docs = docs.map(prune)
    } else {
      method = 'insertOne'
      doc = prune(doc)
    }
    return coll[method](docs || doc)
  }

  // 为了数据安全 remove为高危方法 添加dangerously语义
  // 日常使用delete 修改状态
  static async dangerouslyDelete ({ many, filter }) {
    let coll = await this.getColl()
    let method = many ? 'deleteMany' : 'deleteOne'
    return coll[method](filter)
  }

  static async dangerouslyDrop () {
    let coll = await this.getColl()
    return coll.drop()
  }

  // 暂时只支持 $set操作符
  // $unset的validate环节 负担太重 暂不支持
  static async update ({ many, filter, set }) {
    let coll = await this.getColl()
    set = this.prune({ data: set, partial: true })

    let update = { $set: set }
    let method = many ? 'updateMany' : 'updateOne'
    return coll[method](filter, update)
  }

  static async index (spec, options) {
    let coll = await this.getColl()
    return coll.ensureIndex(spec, options)
  }

  static async getColl () {
    return getColl(this.getCollName())
  }
  // 用于定制collName映射关系
  static getCollName () {
    return this.name
  }
}

let bSchemaCopy = _.clone(B.schema)
C.schema = _.assign(bSchemaCopy, {
  _id: {
    type: ObjectID,
    default: () => new ObjectID()
  }
})

module.exports = C
