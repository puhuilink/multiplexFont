import { BaseDao } from './BaseDao'
import { alert } from '../config/client'

class AuthorizeObjectDao extends BaseDao {
  static schema = 't_authorize_object'
  static provider = alert
}

export {
  AuthorizeObjectDao
}
