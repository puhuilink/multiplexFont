import { BaseDao } from '@/api/dao/BaseDao'
import { imp } from '@/utils/clientConfig'

export class ModelStrategyDao extends BaseDao {
  // 对应 hasura schema
  static SCHEMA = 't_model_strategy'

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
}
