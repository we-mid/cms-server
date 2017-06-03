let { MongoClient } = require('mongodb')
let { dbName, mongoPort } = require('../config')
let cachedDb

exports.getColl = getColl
async function getColl (key) {
  if (!key) {
    throw new Error(`resource key is required, got "${key}"`)
  }
  let db = await getDb()
  let coll = await db.collection(key)
  return coll
}

exports.closeDb = closeDb
async function closeDb () {
  let db = await getDb()
  await db.close()
}

// todo: db connection pool
async function getDb () {
  let db = cachedDb
  if (db) return db
  let url = `mongodb://localhost:${mongoPort}/${dbName}`
  db = await MongoClient.connect(url)
  cachedDb = db
  return db
}
