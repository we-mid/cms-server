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
