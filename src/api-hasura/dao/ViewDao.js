import { BaseDao } from './BaseDao'
import { provider, schema } from '../utils/decorator/hasura'
import { alert } from '../config/client'

@schema('t_view')
@provider(alert)
class ViewDao extends BaseDao {
  static add () {

  }
}

export {
  ViewDao
}
