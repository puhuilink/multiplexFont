import { BaseDao } from './BaseDao'
import { resource } from '../config/client'
import { defaultCreateTime, defaultUpdateTime } from '../utils/mixin/autoComplete'
import { override, readonly } from 'core-decorators'

class ModelDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 'ngecc_model'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = resource

  // 唯一字段
  @readonly
  static UNIQUE_FIELDS = ['name_s', 'did']

  // 主键
  @readonly
  static PRIMARY_KEY = 'did'

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['name_s', '名称']
  ])

  @override
  static async add (model) {
    // 验证唯一字段是否有冲突
    await this._uniqueValidate(model)
    // 自增 id
    const did = (await this._fetchMaxPrimarykey()) + 1
    return super.add({
      did,
      ...model,
      ...defaultCreateTime(true)
    })
  }

  @override
  static async update ({ ...model }, { did }) {
    await this._uniqueValidate({ ...model, did }, false)
    return super.update({ ...model, ...defaultUpdateTime(true) }, { did })
  }
}

export {
  ModelDao
}
