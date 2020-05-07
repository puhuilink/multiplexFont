import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { readonly } from 'core-decorators'

class UserGroupDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_user_group'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = alert

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['group_id', 'group_id'],
    ['user_id', 'user_id']
  ])
}

export {
  UserGroupDao
}
