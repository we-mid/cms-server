let { join } = require('path')

// hack: detect whether it is in ava test
let isAva = process.argv[1] &&
  process.argv[1].includes('node_modules/ava')

let isTesting = isAva || process.env.NODE_ENV === 'testing'
let isProduction = process.env.NODE_ENV === 'production'

let envPort = process.env.PORT
let config = {
  env: process.env.NODE_ENV,
  app: {
    secretKeys: ['some-secret-keys'],
    uploadDir: join(__dirname, './upload'),
    port: envPort || 3001
  },
  mongo: {
    db: 'we-admin-dev'
  }
}

if (isTesting) {
  config.app.port = envPort || 3003
  config.mongo.db = 'we-admin-test'
} else if (isProduction) {
  config.app.port = envPort || 3005
  config.mongo.db = 'we-admin-prod'
}

module.exports = config
