import { BaseDao } from './BaseDao'
import { batchQuery } from '../utils/hasura-orm'
import { alert } from '../config/client'

class UserDao extends BaseDao {
  static schema = 't_user'
  static provider = alert

  static fieldsMapping = new Map([
    ['user_id', '用户名'],
    ['email', 'Email'],
    ['phone', '办公电话'],
    ['mobile_phone', '移动电话']
  ])

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
