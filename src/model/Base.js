let list = [
  'mongo-model-2/src/SchemaBase',
  'mongo-model-2/src/DbBase',
  'mongo-model-2/src/CollBase',
  'mongo-model-2/src/DateBase',
  './AppBase'
].map(require)

// 将list循环继承 出一个最终的Base类
let Base = list.reduce((B, fn) => {
  let C = fn(B)
  return C
}, null)

module.exports = Base

Base.mongoConfig = {
  port: process.env.MONGO_PORT,
  dbName: process.env.MONGO_DBNAME
}
