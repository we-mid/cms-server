let { init } = require('./proc') // 始终最前
let { app: { port } } = require('../config')
let app = require('./app')

let server = app.listen(port)
init('server', { port })

module.exports = server
