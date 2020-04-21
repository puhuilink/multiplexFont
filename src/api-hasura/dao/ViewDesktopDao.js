import { ViewDao } from './ViewDao'
import { override } from 'core-decorators'

class ViewDesktopDao extends ViewDao {
  @override
  static add () {

  }

  @override
  static batchDelete (where) {
    // TODO: where 若传入空对象会清空所有
    const { hasuraORM } = this
    return hasuraORM.delete({
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
