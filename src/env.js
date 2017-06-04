let { mongoPort, dbName } = require('../config')

process.env.MONGO_PORT = mongoPort
process.env.MONGO_DBNAME = dbName
