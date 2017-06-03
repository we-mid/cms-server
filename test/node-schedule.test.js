let { scheduleJob } = require('node-schedule')
let { spy, useFakeTimers } = require('sinon')
let { test } = require('ava')
let { sleep } = require('../util')
let clock

test.before(() => {
  clock = useFakeTimers()
})
test.after(() => {
  clock.restore()
})

// 每秒执行一次的任务 3秒后应该执行3次
test.serial('every second', async t => {
  let callback = spy()
  // scheduleJob({ second: null }, callback)
  scheduleJob('* * * * * *', callback)

  let duration = 1000 * 3
  await travel(duration)
  t.is(callback.callCount, 3)
})

// 每分钟执行一次的任务 3分钟后应该执行3次
test.serial('every minute', async t => {
  let callback = spy()
  // scheduleJob({ minute: null }, callback)
  scheduleJob('* * * * *', callback)

  let duration = 1000 * 60 * 3
  await travel(duration)
  t.is(callback.callCount, 3)
})

// 每15分钟执行一次的任务 3小时后应该执行12次
test.serial('every 15 minutes', async t => {
  let callback = spy()
  // scheduleJob({ minute: [0, 15, 30, 45] }, callback)
  scheduleJob('*/15 * * * *', callback)

  let duration = 1000 * 60 * 60 * 3
  await travel(duration)
  t.is(callback.callCount, 12)
})

// 延时并加速时钟
async function travel (duration) {
  await Promise.all([
    sleep(duration), // 必须先sleep后tick 才能达到目的
    tick(duration)
  ])
}
async function tick (duration) {
  clock.tick(duration)
}
