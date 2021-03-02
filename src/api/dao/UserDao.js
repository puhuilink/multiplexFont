import { BaseDao } from './BaseDao'
import { imp } from '../config/client'
import { defaultCreateDate, defaultUpdateDate } from '../utils/mixin/autoComplete'

class UserDao extends BaseDao {
  // 对应 hasura schema
  static SCHEMA = 't_user'

  // 对应 vue-apollo
  static PROVIDER = imp

  // 唯一字段
  // static UNIQUE_FIELDS = ['user_id', 'email', 'mobile_phone']
  // 注释部分是为防止以后再次需要添加唯一邮箱校验。

  static UNIQUE_FIELDS = ['user_id', 'mobile_phone']

  // 主键
  static PRIMARY_KEY = 'user_id'

  // 字段与显示文字
  static FIELDS_MAPPING = new Map([
    ['user_id', '用户名'],
    ['email', 'Email'],
    ['mobile_phone', '移动电话']
  ])

  static async find ({ orderBy = { createdate: 'desc_nulls_last' }, ...rest }) {
    return super.find({ orderBy, ...rest })
  }

  static async add (user) {
    await this._uniqueValidate(user)
    return super.add({
      auth_method: 'DB',
      ...user,
      ...defaultCreateDate()
    })
  }

  static async update ({ ...user }, { user_id }) {
    await this._uniqueValidate({ ...user, user_id }, false)
    return super.update({ ...user, ...defaultUpdateDate() }, { user_id })
  }
}

export {
  UserDao
}
