import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { defaultCreateDate, defaultUpdateDate } from '../utils/mixin/autoComplete'

class UserDao extends BaseDao {
  // 对应 hasura schema
  static schema = 't_user'
  // 对应 vue-apollo
  static provider = alert
  // 唯一字段
  static UNIQUE_FIELDS = ['user_id', 'email', 'phone', 'mobile_phone']
  // 主键
  static PRIMARY_KEY = 'user_id'
  // 字段与显示文字
  static FIELDS_MAPPING = new Map([
    ['user_id', '用户名'],
    ['email', 'Email'],
    ['phone', '办公电话'],
    ['mobile_phone', '移动电话']
  ])

  static add (user) {
    return super.add({
      auth_method: 'DB',
      ...user,
      ...defaultCreateDate()
    })
  }

  static update ({ user_id, ...user }) {
    return super.update({ ...user, ...defaultUpdateDate() }).where({ user_id })
  }
}

export {
  UserDao
}
