let { ObjectID } = require('mongodb')

exports.Product = (() => {
  let docs = [
    // todo: make `category` an array list
    { provider: 'jyj', category: 'lc', name: '特制鸡块饭', price: 25 },
    { provider: 'mdw', category: 'bf', name: '小笼包', price: 18 },
    { provider: 'ksf', category: 'bf', name: '芝士蛋糕', price: 22 }
  ]
  docs.forEach(wrapDoc)
  return docs
})()

exports.User = (() => {
  let docs = [
    { roles: [8], name: 'Provider 01', account: 'provider', password: 'provider' },
    { roles: [1, 5], ad: 'admin01', name: 'Admin 01', account: 'admin', password: 'admin' },
    { roles: [1], ad: 'test0008', name: 'test0008' },
    { roles: [1], ad: 'nesger.guo', name: '铜仁' },
    { roles: [1], ad: 'leo.lin', name: 'Leo' }
  ]
  docs.forEach(wrapDoc)
  return docs
})()

exports.Order = (() => {
  let docs = [
    { product: '3', amount: 2, sum: 44, user: '2', address: '中兴西座 15F' },
    { product: '2', amount: 3, sum: 54, user: '3', address: '康佳研发 21F' }
  ]
  docs.forEach(wrapDoc)
  return docs
})()

function wrapDoc (doc, i) {
  doc._id = new ObjectID()
  doc.createdAt = new Date()
  doc.uid = `${i + 1}` // uid统一为字符串
}
