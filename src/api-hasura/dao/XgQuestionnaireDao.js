import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class XgQuestionnaireDao extends BaseDao {
  @readonly
  static SCHEMA = 't_xg_questionnaire'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  XgQuestionnaireDao
}
