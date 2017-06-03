let supertest = require('supertest')
let { test } = require('ava')
let _ = require('lodash')
let server = require('../')
let { t2p } = require('../util')

// todo: we need a DAO to access db directly
// to remove existed data before test

test(async t => {
  let docs
  await testServer(t, s => {
    return s.get('/api/products/list')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        docs = res.body.docs
      })
  })

  let uids = _.map(docs, 'uid')

  await testServer(t, s => {
    return s.post('/api/products/delete')
      .send({ uids })
      .expect(200)
      .expect('Content-Type', /json/)
      // expect
  })
})

test(async t => {
  await testServer(t, s => {
    return s.post('/api/products/create')
      .send({
        name: 'Name 123',
        description: 'Description 123'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({ ret: { n: 1, ok: 1 } })
  })
})

async function testServer (t, fn) {
  await t.notThrows(t2p(done => {
    let s = supertest(server)
    fn(s).end(done)
  }))
}
