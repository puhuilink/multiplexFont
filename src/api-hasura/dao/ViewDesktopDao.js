import { ViewDao } from './ViewDao'

class ViewDesktopDao extends ViewDao {
  static add () {

  }

  static batchDelete (where) {
    // TODO: where 若传入空对象会清空所有
    return super.batchDelete({
      ...where,
      view_type: {
        _eq: 'desktop'
      }
    })
  }
}

export {
  ViewDesktopDao
}
