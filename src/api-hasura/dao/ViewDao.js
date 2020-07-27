import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { defaultCreateDate, defaultUpdateDate } from '../utils/mixin/autoComplete'
import { override, readonly } from 'core-decorators'

class ViewDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_view'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = alert

   // 唯一字段
   @readonly
   static UNIQUE_FIELDS = ['view_id', 'view_title']

   // 主键
   @readonly
   static PRIMARY_KEY = 'view_id'

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['view_id', '视图ID'],
    ['view_title', '视图标题']
  ])

  @override
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
