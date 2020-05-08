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

  // 字段与显示文字
  @readonly
  static FIELDS_MAPPING = new Map([
    ['view_id', 'view_id']
  ])

  @override
  static async add (view) {
    return super.add({
      ...view,
      ...defaultCreateDate()
    })
  }

  // FIXME: override 入参不一致
  static async update ({ view_id, ...view }) {
    return super.update({ ...view, ...defaultUpdateDate() }).where({ view_id })
  }
}

export {
  ViewDao
}
