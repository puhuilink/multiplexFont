import { BaseDao } from './BaseDao'
import { provider, schema } from '../utils/decorator/hasura'
import { alert } from '@/utils/clientConfig'

@schema('t_user')
@provider(alert)
class UserDao extends BaseDao {

}

export {
  UserDao
}
