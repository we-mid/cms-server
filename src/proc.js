let { NODE_ENV } = require('./env')
let { pickError } = require('../util')
let onExit = require('signal-exit')
let logger = require('./logger')

exports.init = init
function init (key = '(proc)', opts) {
  let o = Object.assign({}, opts, { NODE_ENV })
  logger.info(`${key}开始启动`, o)

  onExit((code, signal) => {
    // 退出时无法写入log文件
    // https://github.com/winstonjs/winston/issues/228
    let o = Object.assign({}, opts, { code, signal })
    logger.info(`${key}进程退出`, o)
  })

  process.on('uncaughtException', err => {
    err = pickError(err)
    logger.error(`${key} uncaughtException`, { err })
  })
}
