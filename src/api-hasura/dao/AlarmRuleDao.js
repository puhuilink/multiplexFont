import { imp } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class AlarmRuleDao extends BaseDao {
  @readonly
  static SCHEMA = 't_alarm_rule'

  @readonly
  static PROVIDER = imp

  @readonly
  static PRIMARY_KEY = 'id'

  @readonly
  static FIELDS_MAPPING = new Map([])

  static async find ({ orderBy = { id: 'desc_nulls_last' }, ...rest }) {
    return super.find({ orderBy, ...rest })
  }
}

export {
  AlarmRuleDao
}
