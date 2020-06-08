import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class ModelMetricDao extends BaseDao {
  @readonly
  static SCHEMA = 't_model_metric'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  ModelMetricDao
}
