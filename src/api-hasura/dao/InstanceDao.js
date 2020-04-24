import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
// eslint-disable-next-line no-unused-vars
import { override, readonly } from 'core-decorators'

class InstanceDao extends BaseDao {
  @readonly
  static SCHEMA = 'ngecc_instance'
  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([
    ['_id_s', '_id_s'],
    ['name_s', '名称'],
    ['label_s', '显示名称']
  ])
}

export {
  InstanceDao
}
