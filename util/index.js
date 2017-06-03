let _ = require('lodash')

exports.isTest = isTest
function isTest () {
  return process.argv[2].includes('node_modules/ava')
}

exports.t2p = t2p
function t2p (thunk) {
  return new Promise((resolve, reject) => {
    thunk((err, ...args) => {
      err ? reject(err) : resolve(args)
    })
  })
}

exports.sleep = sleep
function sleep (duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  })
}

exports.toFieldsObj = toFieldsObj
function toFieldsObj (arr) {
  let obj = arr.reduce((acc, v) => {
    acc[v] = 1
    return acc
  }, {})
  obj = _.defaults({}, obj, { _id: 0 }) // 默认不显示_id
  return obj
}

exports.toFieldsArr = toFieldsArr
function toFieldsArr (obj) {
  return _.reduce(obj, (acc, v, k) => {
    if (v) acc.push(k)
    return acc
  }, [])
}
