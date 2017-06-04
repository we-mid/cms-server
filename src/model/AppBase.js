let decamelize = require('decamelize')
let pluralize = require('pluralize')
let uuid = require('uuid')
let _ = require('lodash')

module.exports = B => {
  let C = class AppBase extends B {
    // 扩展find 机密字段保护
    static async find ({ one, filter, fields, sort, skip, limit }) {
      if (!fields || !fields.length) {
        throw new Error('fields必须明确定义')
      }
      let sect = _.intersection(fields, this.secretFields)
      if (sect.length) {
        throw new Error(`其中${sect}为机密字段 不可直接返回`)
      }
      return super.find({ one, filter, fields, sort, skip, limit })
    }

    // list 便于分页场景的find
    static async list ({ filter, fields, pagin }) {
      let { sort, skip, limit } = pagin
      let [total, docs] = await Promise.all([
        this.count({ filter }), // 获取总个数
        this.find({ filter, fields, sort, skip, limit })
      ])
      return { total, docs }
    }

    static genDocUid () {
      return uuid().substr(0, 8)
    }

    // 提供更贴近用户的语义名词 去驼峰+复数
    static getResName () {
      return pluralize(decamelize(this.name, '-'))
    }
  }

  let bSchemaCopy = _.clone(B.schema)
  C.schema = _.assign(bSchemaCopy, {
    uid: {
      type: String,
      default: () => C.genDocUid()
    }
  })
  C.secretFields = []

  return C
}
