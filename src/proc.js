let { NODE_ENV } = require('./env')
let { pickError } = require('../util')
let onExit = require('signal-exit')
let logger = require('./logger')

exports.init = init
function init (key = '(proc)', opts) {
  process._key = key

  let o = Object.assign({}, opts, { NODE_ENV })
  logger.info(`${key} launched`, o)

  onExit((code, signal) => {
    // 退出时无法写入log文件
    // https://github.com/winstonjs/winston/issues/228
    let o = Object.assign({}, opts, { code, signal })
    logger.info(`${key} exited`, o)
  })
}

exports.onError = onError
function onError (err) {
  err = pickError(err)
  let key = process._key
  logger.error(`${key} onError`, { err })
}

process.on('uncaughtException', err => {
  err = pickError(err)
  let key = process._key
  logger.error(`${key} uncaughtException`, { err })
})
