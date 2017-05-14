let { MongoClient } = require('mongodb')
let { dbName, mongoPort } = require('../config')
let cachedDbs = {}

exports.getColl = getColl
exports.closeDb = closeDb

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
