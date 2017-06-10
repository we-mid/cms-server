let winston = require('winston')
let DailyRotateFile = require('winston-daily-rotate-file')
let fs = require('fs-extra')
let { join } = require('path')

let logDir = join(__dirname, '../log')
fs.ensureDirSync(logDir)

let dailyRotate = new DailyRotateFile({
  dirname: logDir,
  filename: '.log',
  datePattern: 'yyyy-MM-dd',
  prepend: true,
  level: process.env.ENV === 'development' ? 'debug' : 'info'
})

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    // new (winston.transports.File)({ filename: 'somefile.log' })
    dailyRotate
  ]
})

module.exports = logger
