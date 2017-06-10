let { NODE_ENV } = require('./env')
let { app: { port } } = require('../config')
let app = require('./app')
let logger = require('./logger')

let server = app.listen(port)
logger.info('server开始运行', { port, NODE_ENV })

module.exports = server
