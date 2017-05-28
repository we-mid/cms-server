let { scheduleJob } = require('node-schedule')

// 每15分钟 执行一次任务
scheduleJob('*15 * * * *', () => {
  // todo
})
