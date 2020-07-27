import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class XgHostRelationDao extends BaseDao {
  @readonly
  static SCHEMA = 't_xg_host_relation'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  XgHostRelationDao
}
