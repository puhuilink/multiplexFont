import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { readonly } from 'core-decorators'

class AuthorizeObjectDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_authorize_object'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = alert

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['object_id', 'object_id']
  ])
}

export {
  AuthorizeObjectDao
}
