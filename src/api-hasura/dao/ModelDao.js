import { BaseDao } from './BaseDao'
import { resource } from '../config/client'
import { defaultCreateTime, defaultUpdateTime } from '../utils/mixin/autoComplete'

class ModelDao extends BaseDao {
  // 对应 hasura schema
  static SCHEMA = 'ngecc_model'
  // 对应 vue-apollo
  static PROVIDER = resource
  // 唯一字段
  static UNIQUE_FIELDS = ['name_s']
  // 主键
  static PRIMARY_KEY = 'name_s'
  // 字段与显示文字
  static FIELDS_MAPPING = new Map([
    ['name_s', '名称']
  ])

  static add (model) {
    return super.add({
      ...model,
      ...defaultCreateTime(true)
    })
  }

  static update ({ did, ...model }) {
    return super.update({ ...model, ...defaultUpdateTime(true) }).where({ did })
  }
}

export {
  ModelDao
}
