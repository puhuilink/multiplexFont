import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { defaultInfo } from '../utils/mixin/autoComplete'
import { override, readonly } from 'core-decorators'
import { varcharUuid } from '@/utils/util'

class ModelDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_cmdb_model'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = alert

  // 唯一字段
  @readonly
  static UNIQUE_FIELDS = ['name']

  // 主键
  @readonly
  static PRIMARY_KEY = 'name'

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['name', '名称']
  ])

  @override
  static async add (model) {
    // 验证唯一字段是否有冲突
    await this._uniqueValidate(model)
    return super.add({
      _id: varcharUuid(),
      ...model,
      ...defaultInfo('createTime', 'creator')
    })
  }

  @override
  static async update ({ ...model }, { _id }) {
    await this._uniqueValidate({ ...model, _id }, false)
    return super.update({ ...model, ...defaultInfo('updateTime', 'updator') }, { _id })
  }
}

export {
  ModelDao
}
