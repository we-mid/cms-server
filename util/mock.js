let { ObjectID } = require('mongodb')

exports.User = (() => {
  let docs = [
    { roles: [8], name: 'Provider 01', account: 'provider', password: 'provider' },
    { roles: [1, 5], ad: 'admin01', name: 'Admin 01', account: 'admin', password: 'admin' },
    { roles: [1], ad: 'test0008', name: 'test0008' },
    { roles: [1], ad: 'nesger.guo', name: '铜仁' },
    { roles: [1], ad: 'Leo Lin', name: 'Leo' }
  ]
  docs.forEach(wrapDoc)
  return docs
})()

function wrapDoc (doc, i) {
  doc._id = new ObjectID()
  doc.createdAt = new Date()
  doc.uid = `${i + 1}` // uid统一为字符串
}
