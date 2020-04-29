import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
// eslint-disable-next-line no-unused-vars
import { override, readonly } from 'core-decorators'

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
}

export {
  InstanceDao
}
