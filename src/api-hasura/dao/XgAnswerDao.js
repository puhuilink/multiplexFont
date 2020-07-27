import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class XgAnswerDao extends BaseDao {
  @readonly
  static SCHEMA = 't_xg_answer'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  XgAnswerDao
}
