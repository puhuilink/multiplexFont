import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class XgHostTypeDao extends BaseDao {
  @readonly
  static SCHEMA = 't_xghost_type'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  XgHostTypeDao
}
