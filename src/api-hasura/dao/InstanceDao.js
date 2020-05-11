import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
// eslint-disable-next-line no-unused-vars
import { override, readonly } from 'core-decorators'
import { defaultInfo } from '../utils/mixin/autoComplete'
import { varcharUuid } from '@/utils/util'

class InstanceDao extends BaseDao {
  @readonly
  static SCHEMA = 't_cmdb_instance'
  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([
    ['_id', '_id'],
    ['name', '名称'],
    ['label', '显示名称']
  ])

  static async add ({ values, ...baseInfo }) {
    // TODO: 唯一校验
    const name = baseInfo.name || values.name
    const label = baseInfo.label || values.label
    const data = {
      values,
      ...baseInfo,
      name,
      label,
      _id: varcharUuid(),
      version: 0,
      ...defaultInfo('createTime', 'creator')
    }
    return super.add(data)
  }
}

export {
  InstanceDao
}
