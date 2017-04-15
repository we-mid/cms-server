let supertest = require('supertest')
let { test } = require('ava')
let app = require('../app')

let port = process.env.PORT || 3002
let server = app.listen(port)

test(async t => {
  await testServer(t, s => {
    return s.get('/')
      .expect(200)
      .expect('Content-Type', /^text\/plain/)
      .expect('Hello')
  })
})

async function testServer (t, fn) {
  await t.notThrows(t2p(done => {
    let s = supertest(server)
    fn(s).end(done)
  }))
}

function t2p (thunk) {
  return new Promise((resolve, reject) => {
    thunk((err, ...args) => {
      err ? reject(err) : resolve(args)
    })
  })
}
