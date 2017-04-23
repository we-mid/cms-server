let { MongoClient } = require('mongodb')
let { dbName } = require('../config')
let cachedDbs = {}

exports.getDb = getDb

function getDb () {
  return getDbByName(dbName)
}

// todo: db connection pool
async function getDbByName (dbName) {
  let db = cachedDbs[dbName]
  if (db) return db
  let url = `mongodb://localhost:27017/${dbName}`
  db = await MongoClient.connect(url)
  cachedDbs[dbName] = db
  return db
}
