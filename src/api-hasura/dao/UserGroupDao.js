import { BaseDao } from './BaseDao'
import { alert } from '../config/client'

class UserGroupDao extends BaseDao {
  static schema = 't_user_group'
  static provider = alert
}

export {
  UserGroupDao
}
