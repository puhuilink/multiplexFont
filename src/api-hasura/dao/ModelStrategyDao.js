import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class ModelStrategyDao extends BaseDao {
  @readonly
  static SCHEMA = 't_model_strategy'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  ModelStrategyDao
}
