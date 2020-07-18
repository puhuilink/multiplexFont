import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class CmdbHostEndpointDao extends BaseDao {
  @readonly
  static SCHEMA = 't_cmdb_host_endpoint'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  CmdbHostEndpointDao
}
