let { validate } = require('schema-validator2')
let _ = require('lodash')

let C = class SchemaBase {
  // 验证data是否符合schema 通过则返回空 不通过则返回原因
  // partial为true表明局部验证 默认为整体验证
  static validate ({ data, partial }) {
    let { schema } = this
    return validate({ schema, data, partial })
  }

  static prune ({ data, partial }) {
    // 如果为整体prune 补充schema中设定的默认值
    if (!partial) {
      data = _.clone(data)
      _.each(this.schema, (r, k) => {
        // mongo数据中 null/undefined视为相同
        let defaultF = r.default
        // if (!defaultF && r.type === String && !r.optional) {
        //   defaultF = ''
        // }
        let isNone = r.type === String
          ? !data[k]
          : data[k] == null
        if (isNone && defaultF != null) {
          let defaultV = _.isFunction(defaultF)
            ? defaultF() : defaultF
          data[k] = defaultV
        }
      })
    }

    // 检验不通过则报错 通过则返回
    let rs = this.validate({ data, partial })
    if (rs) throw new Error(rs)
    return data
  }
}

C.schema = {}

module.exports = C
