let { MongoClient } = require('mongodb')
let { dbName, mongoPort } = require('../config')
let uuid = require('uuid')
let cachedDbs = {}

exports.getColl = getColl
exports.closeDb = closeDb
exports.toFieldsObj = toFieldsObj
exports.genDocUid = genDocUid

// 8-bits is enough, (10+26)**8 = 2,821,109,907,456
function genDocUid () {
  return uuid().substr(0, 8)
}

function toFieldsObj (keys) {
  let obj = keys.reduce((acc, k) => {
    acc[k] = 1
    return acc
  }, {})
  obj._id = 0 // always exclude annoying `_id`
  return obj
}

async function closeDb () {
  let db = await getDb()
  await db.close()
}

async function getColl (key) {
  if (!key) {
    throw new Error(`resource key is required, got "${key}"`)
  }
  let db = await getDb()
  let coll = await db.collection(key)
  return coll
}

function getDb () {
  return getDbByName(dbName)
}

// todo: db connection pool
async function getDbByName (dbName) {
  let db = cachedDbs[dbName]
  if (db) return db
  let url = `mongodb://localhost:${mongoPort}/${dbName}`
  db = await MongoClient.connect(url)
  cachedDbs[dbName] = db
  return db
}
