import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { readonly } from 'core-decorators'

class RelationInstanceDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_cmdb_relationInstance'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = alert
}

export {
  RelationInstanceDao
}
