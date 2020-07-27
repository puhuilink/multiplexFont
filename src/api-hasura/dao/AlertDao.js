import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class AlertDao extends BaseDao {
  @readonly
  static SCHEMA = 't_alert_dao'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  AlertDao
}
