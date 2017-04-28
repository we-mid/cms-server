// hack: detect whether it is in ava test
let isTest = process.argv[1] &&
  process.argv[1].includes('node_modules/ava')

let isProduction = process.env.NODE_ENV === 'production'

// process.env.NODE_ENV is deprecated,
// because it is hard to control
let config = {
  env: 'development',
  dbName: 'we-admin-dev',
  mongoPort: 27017,
  port: 3001
}

if (isTest) {
  Object.assign(config, {
    env: 'test',
    dbName: 'we-admin-test',
    port: 3003
  })
} else if (isProduction) {
  Object.assign(config, {
    env: 'production',
    dbName: 'we-admin-prod',
    port: 3005
  })
}

module.exports = config
