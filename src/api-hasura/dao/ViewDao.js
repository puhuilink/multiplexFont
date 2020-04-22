import { BaseDao } from './BaseDao'
import { alert } from '../config/client'
import { defaultCreateDate, defaultUpdateDate } from '../utils/mixin/autoComplete'

class ViewDao extends BaseDao {
  static schema = 't_view'
  static provider = alert

  static add (view) {
    return super.add({
      ...view,
      ...defaultCreateDate()
    })
  }

  static update ({ view_id, ...view }) {
    return super.update({ ...view, ...defaultUpdateDate() }).where({ view_id })
  }
}

export {
  ViewDao
}
