import { BaseDao } from './BaseDao'
import { alert } from '../config/client'

class AuthorizeObjectDao extends BaseDao {
  static SCHEMA = 't_authorize_object'
  static PROVIDER = alert
}

export {
  AuthorizeObjectDao
}
