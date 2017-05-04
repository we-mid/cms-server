exports.parsePagination = parsePagination

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
