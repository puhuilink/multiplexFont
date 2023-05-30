import { BaseDao } from '@/api/dao/BaseDao'
import { imp } from '@/utils/clientConfig'
import { defaultCreateDate } from '@/api/utils/mixin/autoComplete'

export class PatrolAccessBanDao extends BaseDao {
  // 对应 hasura schema
  static SCHEMA = 'patrol_access_ban'

  // 对应 vue-apollo
  static PROVIDER = imp

  // 唯一字段
  // static UNIQUE_FIELDS = ['user_id', 'email', 'mobile_phone']
  // 注释部分是为防止以后再次需要添加唯一邮箱校验。

  // 主键
  static PRIMARY_KEY = 'id'

  static async find (args = {}) {
    return super.find(args)
  }

  static async add (user) {
    return super.add({
      ...user
    })
  }
}
