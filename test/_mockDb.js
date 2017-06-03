let { toFieldsArr } = require('../util')
let mockData = require('../util/mock')
let { ObjectID } = require('mongodb')
let _ = require('lodash')

// fime: unique/indexes
// mock mongodb coll 便于不经过db 测试model
class MockColl {
  constructor (Model) {
    this.name = Model.name
    this.data = mockData[this.name]
  }

  // fixme: filter, options
  find (filter, options) {
    let fieldsArr = toFieldsArr(options.fields)
    let docs = _.filter(this.data, filter)
    docs = docs.map(doc => {
      return _.pick(doc, fieldsArr)
    })
    return {
      toArray: async () => docs
    }
  }
  async findOne (filter, options) {
    let fieldsArr = toFieldsArr(options.fields)
    let doc = _.find(this.data, filter)
    doc = _.pick(doc, fieldsArr)
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

  // todo: update, delete
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
