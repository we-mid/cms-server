let Base = require('../src/model/Base')
let { ObjectID } = require('mongodb')
let { test } = require('ava')

// partial: true
test(t => {
  let rs = Base.validate({
    partial: true,
    data: {}
  })
  t.falsy(rs)
})

test(t => {
  let rs = Base.validate({
    partial: true,
    data: {
      _id: new ObjectID()
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = Base.validate({
    partial: true,
    data: {
      _id: null
    }
  })
  t.regex(rs, /is required/)
})

test(t => {
  let rs = Base.validate({
    partial: true,
    data: {
      updatedAt: new Date()
    }
  })
  t.falsy(rs)
})

test(t => {
  let rs = Base.validate({
    partial: true,
    data: {
      updatedAt: '123'
    }
  })
  t.regex(rs, /is not a/)
})

test(t => {
  let rs = Base.validate({
    partial: true,
    data: {
      foo: '123'
    }
  })
  t.regex(rs, /extra keys/)
})

// partial: false
test(t => {
  let rs = Base.validate({
    data: {}
  })
  t.regex(rs, /is required/)
})

test(t => {
  let rs = Base.validate({
    data: {
      _id: null
    }
  })
  t.regex(rs, /is required/)
})

test(t => {
  let rs = Base.validate({
    data: {
      _id: new ObjectID()
    }
  })
  t.regex(rs, /is required/)
})

test(t => {
  let rs = Base.validate({
    data: {
      createdAt: new Date(),
      _id: new ObjectID()
    }
  })
  t.falsy(rs)
})
