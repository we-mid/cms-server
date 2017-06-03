let _ = require('lodash')
let KoaBody = require('koa-body')
let fs = require('fs-extra-promise')
let { uploadDir } = require('../../config')

fs.ensureDirSync(uploadDir)

const koaBody = KoaBody()
const koaUpload = KoaBody({
  multipart: true,
  keepExtensions: true,
  formidable: { uploadDir }
})

exports.validate = validate
exports.koaJson = koaJson
exports.koaUpload = koaUpload
exports.parsePagination = parsePagination

function validate (fn) {
  return async (ctx, next) => {
    try {
      fn(ctx)
    } catch (err) {
      ctx.throw(err.status || 400, err)
    }
    await next()
  }
}

async function koaJson (ctx, next) {
  const nx = async () => {
    let { body } = ctx.request
    if (body && _.isString(body)) {
      try {
        body = JSON.parse(body)
      } catch (err) {
        ctx.throw(400, 'json解析出错')
      }
      if (!_.isObject(body)) {
        ctx.throw(400, 'json必须为object类型')
      }
      ctx.request.body = body
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
    sort = { _id: +sort }
  } else {
    sort = { _id: -1 }
  }
  return { skip, limit, sort }
}

exports.koaPagin = koaPagin
async function koaPagin (ctx, next) {
  if (ctx.method === 'GET') {
    let { page, skip, limit } = ctx.query
    limit = parseInt(limit) || 10
    if ('skip' in ctx.query) {
      skip = parseInt(skip) || 0
    } else {
      page = parseInt(page) || 1
      skip = limit * (page - 1)
    }
    // todo: 可多个字段 组合sort
    let sort = { createdAt: -1 } // 默认按日期逆序
    ctx.state.pagin = { skip, limit, sort }
  }
  await next()
}
