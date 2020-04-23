import { BaseDao } from './BaseDao'
import { alert } from '../config/client'

class UserGroupDao extends BaseDao {
  static SCHEMA = 't_user_group'
  static PROVIDER = alert
}

export {
  UserGroupDao
}
