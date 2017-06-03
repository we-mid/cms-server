let { scheduleJob } = require('node-schedule')
let logger = require('./logger')

logger.info('schedule开始运行')

// 每15分钟 执行一次任务
scheduleJob('*/15 * * * *', () => {
  // todo
  logger.info('每15分钟 执行一次任务')
})
