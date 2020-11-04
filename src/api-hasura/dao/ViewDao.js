import { BaseDao } from './BaseDao'
import { imp } from '../config/client'
import { defaultCreateDate, defaultUpdateDate } from '../utils/mixin/autoComplete'

class ViewDao extends BaseDao {
  // 对应 hasura schema
  static SCHEMA = 't_view'

  // 对应 vue-apollo
  static PROVIDER = imp

  // 唯一字段
  static UNIQUE_FIELDS = ['view_id', 'view_title']

  // 主键
  static PRIMARY_KEY = 'view_id'

  // 字段与显示文字
  static FIELDS_MAPPING = new Map([
    ['view_id', '视图ID'],
    ['view_title', '视图标题']
  ])

  static async add (view) {
    return super.add({
      ...view,
      ...defaultCreateDate()
    })
  }

  static async update ({ ...view }, { ...where }) {
    return super.update({ ...view, ...defaultUpdateDate() }, where)
  }
}

export {
  ViewDao
}
