import { BaseDao } from './BaseDao'
import { alert } from '../config/client'

class ViewDao extends BaseDao {
  static schema = 't_view'
  static provider = alert
}

export {
  ViewDao
}
