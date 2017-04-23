// hack: detect whether it is in ava test
let isTest = process.argv[1] &&
  process.argv[1].includes('node_modules/ava')

// process.env.NODE_ENV is deprecated,
// because it is hard to control
let config = {
  env: 'development',
  dbName: 'we-admin',
  port: 3001
}

if (isTest) {
  Object.assign(config, {
    env: 'test',
    dbName: 'we-admin-test',
    port: 3003
  })
}

module.exports = config
