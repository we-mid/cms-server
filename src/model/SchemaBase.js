let { validate } = require('schema-validator2')
let _ = require('lodash')

let C = class SchemaBase {
  // 验证data是否符合schema 通过则返回空 不通过则返回原因
  // partial为true表明局部验证 默认为整体验证
  static validate ({ data, partial, exclude }) {
    let { schema } = this
    schema = _.clone(schema)
    if (exclude) { // 在此处实现exclude字段的功能
      _.each(exclude, k => {
        delete schema[k]
      })
    }
    return validate({ schema, data, partial })
  }

  static prune ({ data, partial, exclude }) {
    // 补充schema中设定的默认值
    data = _.clone(data)
    _.each(this.schema, (r, k) => {
      // mongo数据中 null/undefined视为相同
      if (data[k] == null && r.default != null) {
        let defaultV = _.isFunction(r.default)
          ? r.default() : r.default
        data[k] = defaultV
      }
    })

    // 检验不通过则报错 通过则返回
    let rs = this.validate({ data, partial, exclude })
    if (rs) throw new Error(rs)
    return data
  }
}

C.schema = {}

module.exports = C
