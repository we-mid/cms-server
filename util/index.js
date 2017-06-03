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
  return arr.reduce((acc, v) => {
    acc[v] = 1
    return acc
  }, {})
}

exports.toFieldsArr = toFieldsArr
function toFieldsArr (obj) {
  return Object.keys(obj)
}
