import { imp } from '../config/client'
import { BaseDao } from './BaseDao'

class ApSourceDao extends BaseDao {
  static SCHEMA = 'ap_source'

  static PROVIDER = imp

  static PRIMARY_KEY = 'id'

  static FIELDS_MAPPING = new Map([])

  static async find ({ orderBy = { id: 'desc_nulls_last' }, ...rest }) {
    return super.find({ orderBy, ...rest })
  }
}

export {
  ApSourceDao
}
