let { MongoClient } = require('mongodb')

// 确保在多个子类中 只有一份cache
// 存在该局部变量中 保护起来
let cachedDbs = {}

module.exports = B => {
  let C = class DbBase extends B {
    static async getDb () {
      let { port, dbName } = this.mongoConfig
      let key = `${port}_${dbName}`
      let db = cachedDbs[key]
      if (db) return db

      let url = `mongodb://localhost:${port}/${dbName}`
      db = await MongoClient.connect(url)
      cachedDbs[key] = db
      return db
    }
  }

  // 可以在子类Base中覆盖配置
  C.mongoConfig = {
    port: 27017,
    dbName: 'example'
  }
  return C
}
