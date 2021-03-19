import { BaseDao } from './BaseDao'
import { imp } from '../config/client'
// import { defaultCreateDate, defaultUpdateDate } from '../utils/mixin/autoComplete'

class ThemeDao extends BaseDao {
  // 对应 hasura schema
  static SCHEMA = 't_theme'

  // 对应 vue-apollo
  static PROVIDER = imp

  // 唯一字段
  static UNIQUE_FIELDS = ['id']

  // 主键
  static PRIMARY_KEY = 'id'

  // 字段与显示文字
  // static FIELDS_MAPPING = new Map([
  //   ['id', '主题id']
  // ])

  static async find ({ ...rest }) {
    return super.find({ ...rest })
  }
}

export {
  ThemeDao
}
