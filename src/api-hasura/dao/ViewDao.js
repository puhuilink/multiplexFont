import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { defaultCreateDate, defaultUpdateDate } from '../utils/mixin/autoComplete'

class ViewDao extends BaseDao {
  static SCHEMA = 't_view'
  static PROVIDER = alert

  static async add (view) {
    return super.add({
      ...view,
      ...defaultCreateDate()
    })
  }

  static async update ({ view_id, ...view }) {
    return super.update({ ...view, ...defaultUpdateDate() }).where({ view_id })
  }
}

export {
  ViewDao
}
