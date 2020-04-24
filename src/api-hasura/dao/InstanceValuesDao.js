import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
// eslint-disable-next-line no-unused-vars
import { override, readonly } from 'core-decorators'

class InstanceValuesDao extends BaseDao {
  @readonly
  static SCHEMA = 'ngecc_instance'

  @readonly
  static PROVIDER = alert

  @readonly
  static UNIQUE_FIELDS = ['kpicode_s']

  @readonly
  static PRIMARY_KEY = 'rid'

  @readonly
  static FIELDS_MAPPING = new Map([
    ['rid', 'rid'],
    ['did', 'did'],
    ['name_s', '名称'],
    ['label_s', '显示名称'],
    ['kpicode_s', 'KPI编码']
  ])
}

export {
  InstanceValuesDao
}
