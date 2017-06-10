let { init } = require('./proc') // 始终最前
let { scheduleJob } = require('node-schedule')
let logger = require('./logger')

init('schedule')

// 每15分钟 执行一次任务
scheduleJob('*/15 * * * *', () => {
  // todo
  logger.info('每15分钟 执行一次任务')
})
