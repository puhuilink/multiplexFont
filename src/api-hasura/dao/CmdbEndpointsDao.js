import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class CmdbEndpointsDao extends BaseDao {
  @readonly
  static SCHEMA = 't_cmdb_endpoints'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  CmdbEndpointsDao
}
