exports.t2p = t2p
exports.isTest = isTest

function isTest () {
  return process.argv[2].includes('node_modules/ava')
}

function t2p (thunk) {
  return new Promise((resolve, reject) => {
    thunk((err, ...args) => {
      err ? reject(err) : resolve(args)
    })
  })
}
