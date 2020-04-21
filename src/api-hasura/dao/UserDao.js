import { BaseDao } from './BaseDao'
import { primaryKey, provider, schema } from '../utils/decorator/hasura'
import { batchQuery } from '../utils/hasura-orm'
import { alert } from '../config/client'
import { override } from 'core-decorators'

@schema('t_user')
@primaryKey('user_id')
@provider(alert)
class UserDao extends BaseDao {
  @override
  static async add ({
    user_id,
    email,
    phone,
    mobile_phone,
    ...user
  }) {
    const { hasuraORM } = this
    // console.log(hasuraORM)
    // console.dir(this)
    const { data } = await batchQuery(
      hasuraORM.where({
        user_id: {
          _eq: user_id.trim()
        }
      }).select(['user_id']),
      hasuraORM.where({
        email: {
          _eq: email.trim()
        }
      }).select(['user_id'])
    )
    console.log(data)
  }
}

export {
  UserDao
}
