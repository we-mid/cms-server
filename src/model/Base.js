let list = [
  './SchemaBase',
  './DbBase',
  './CollBase',
  './DateBase',
  './AppBase'
].map(require)

// 将list循环继承 出一个最终的Base类
let Base = list.reduce((B, fn, i) => {
  let C = fn(B)
  return C
}, null)

module.exports = Base
