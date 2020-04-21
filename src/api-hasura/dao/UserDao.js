import { BaseDao } from './BaseDao'
import { alert } from '@/utils/clientConfig'
import { SchemaDecorator } from '../decorator'
const { provider, schema } = SchemaDecorator

@schema('t_user')
@provider(alert)
class UserDao extends BaseDao {
  static find (options) {
    return super.find({
      orderBy: { user_id: 'desc' },
      fields: ['user_id'],
      ...options
    })
  }
}

export {
  UserDao
}
