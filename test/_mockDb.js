let { toFieldsArr } = require('../util')
let { ObjectID } = require('mongodb')
let mockData = require('./_mockData')
let _ = require('lodash')

// fime: unique/indexes
// mock mongodb coll 便于不经过db 测试model
class MockColl {
  constructor (Model) {
    this.name = Model.name
    this.data = mockData[this.name]
  }

  static _fixFilter (filter) {
    // 此处模拟 mongo数据中 null/undefined视为相同
    let isDeleted = false
    if (filter.deletedAt == null) {
      filter = _.omit(filter, 'deletedAt')
    } else {
      isDeleted = true
    }
    let matchDeletedAt = doc => {
      return isDeleted ? true : doc.deletedAt == null
    }
    return doc => {
      return _.isMatch(doc, filter) && matchDeletedAt(doc)
    }
  }

  // fixme: filter, options
  // result.acknowledged with write concern
  find (filter, options) {
    let C = this.constructor
    filter = C._fixFilter(filter)
    let docs = _.filter(this.data, filter)
    let fieldsArr = toFieldsArr(options.fields)
    docs = docs.map(doc => {
      return _.pick(doc, fieldsArr)
    })
    return {
      toArray: async () => docs
    }
  }
  async findOne (filter, options) {
    let C = this.constructor
    filter = C._fixFilter(filter)
    let doc = _.find(this.data, filter) || null
    let fieldsArr = toFieldsArr(options.fields)
    if (doc) {
      doc = _.pick(doc, fieldsArr)
    }
    return doc
  }

  async insertMany (docs) {
    docs = docs.map(doc => {
      doc = _.clone(doc)
      doc._id = doc._id || new ObjectID()
      return doc
    })
    docs.forEach(doc => {
      this.data.push(doc)
    })
    let count = docs.length
    return {
      result: { ok: 1, n: count },
      insertedCount: count,
      insertedIds: _.map(docs, '_id'),
      ops: docs
    }
  }
  async insertOne (doc) {
    return this.insertMany([doc])
  }

  // update暂时支持$set操作符
  async updateMany (filter, update) {
    let C = this.constructor
    filter = C._fixFilter(filter)
    let { $set } = update
    let docs = _.filter(this.data, filter)
    docs.forEach(doc => {
      _.assign(doc, $set)
    })
    let count = docs.length
    return {
      matchedCount: count,
      modifiedCount: count
    }
  }
  async updateOne (filter, update) {
    let C = this.constructor
    filter = C._fixFilter(filter)
    let { $set } = update
    let doc = _.find(this.data, filter)
    if (doc) {
      _.assign(doc, $set)
    }
    let count = doc ? 1 : 0
    return {
      matchedCount: count,
      modifiedCount: count
    }
  }

  async deleteMany (filter) {
    let C = this.constructor
    filter = C._fixFilter(filter)
    let deleted = _.reject(this.data, filter)
    let count = deleted.length
    return {
      deletedCount: count
    }
  }
  async deleteOne (filter) {
    let C = this.constructor
    filter = C._fixFilter(filter)
    let index = _.findIndex(this.data, filter)
    let exists = index >= 0
    if (exists) {
      this.data.splice(index, 1)
    }
    let count = exists ? 1 : 0
    return {
      deletedCount: count
    }
  }
}

exports.useMockDb = useMockDb
function useMockDb (Model) {
  let mockColl = new MockColl(Model)
  let original = Model.getColl

  Model._mockData = mockData[Model.name]
  Model.getColl = async () => mockColl

  Model.restoreMockDb = () => {
    Model.getColl = original
    delete Model._mockData
  }
}
