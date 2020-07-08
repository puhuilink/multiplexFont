import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class XgQuestionnaireHostsDao extends BaseDao {
  @readonly
  static SCHEMA = 't_xg_questionnaire_hosts'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  XgQuestionnaireHostsDao
}
