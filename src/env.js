let { NODE_ENV } = process.env
process.env.NODE_ENV = NODE_ENV || 'development'

module.exports = process.env
