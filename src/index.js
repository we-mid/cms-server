let { port } = require('../config')
port = process.env.PORT || port
let app = require('./app')
let server = app.listen(port)

module.exports = server
