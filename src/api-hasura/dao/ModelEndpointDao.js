import { imp } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class ModelEndpointDao extends BaseDao {
  @readonly
  static SCHEMA = 't_model_endpoint'

  @readonly
  static PROVIDER = imp

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  ModelEndpointDao
}
