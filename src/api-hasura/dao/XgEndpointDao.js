import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class XgEndpointDao extends BaseDao {
  @readonly
  static SCHEMA = 't_xg_endpoint'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  XgEndpointDao
}