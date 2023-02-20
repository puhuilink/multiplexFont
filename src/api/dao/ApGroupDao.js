import { imp } from '../config/client'
import { BaseDao } from './BaseDao'

class ApGroupDao extends BaseDao {
  static SCHEMA = 'ap_group'

  static PROVIDER = imp

  static PRIMARY_KEY = 'id'

  static FIELDS_MAPPING = new Map([])

  static async find ({ orderBy = { id: 'desc_nulls_last' }, ...rest }) {
    return super.find({ orderBy, ...rest })
  }
}

export {
  ApGroupDao
}
