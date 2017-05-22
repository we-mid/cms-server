let _ = require('lodash')
let KoaBody = require('koa-body')
let fs = require('fs-extra-promise')
let { uploadDir } = require('../../config')

fs.ensureDirSync(uploadDir)

const koaBody = KoaBody()
const koaUpload = KoaBody({
  multipart: true,
  formidable: { uploadDir }
})

exports.koaJson = koaJson
exports.koaUpload = koaUpload
exports.parsePagination = parsePagination

async function koaJson (ctx, next) {
  const nx = async () => {
    let { body } = ctx.request
    if (body && _.isString(body)) {
      try {
        ctx.request.body = JSON.parse(body)
      } catch (err) {
        ctx.throw(400, new Error(`invalid json body, got: ${body}`))
      }
    }
    await next()
  }
  await koaBody(ctx, nx)
}

function parsePagination (ctx) {
  let { page, skip, limit, sort } = ctx.query
  limit = parseInt(limit) || 10
  if ('skip' in ctx.query) {
    skip = parseInt(skip) || 0
  } else {
    page = parseInt(page) || 1
    skip = limit * (page - 1)
  }
  if (sort) {
    sort = { createdAt: +sort }
  }
  return { skip, limit, sort }
}
