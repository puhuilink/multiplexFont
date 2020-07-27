import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class CmdbMetricDao extends BaseDao {
  @readonly
  static SCHEMA = 't_cmdb_metric'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  CmdbMetricDao
}
