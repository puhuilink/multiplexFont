import { imp } from '../config/client'
import { BaseDao } from './BaseDao'

class PatrolThresholdDao extends BaseDao {
  static SCHEMA = 't_patrol_threshold'

  static PROVIDER = imp

  static PRIMARY_KEY = 'id'

  static FIELDS_MAPPING = new Map([])

  static async find ({ orderBy = { id: 'desc_nulls_last' }, ...rest }) {
    return super.find({ orderBy, ...rest })
  }
}

export {
  PatrolThresholdDao
}
