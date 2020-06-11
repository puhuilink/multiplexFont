import { alert } from '../config/client'
import { BaseDao } from './BaseDao'
import { readonly } from 'core-decorators'

class CmdbTagsDao extends BaseDao {
  @readonly
  static SCHEMA = 't_cmdb_tags'

  @readonly
  static PROVIDER = alert

  @readonly
  static FIELDS_MAPPING = new Map([])
}

export {
  CmdbTagsDao
}
