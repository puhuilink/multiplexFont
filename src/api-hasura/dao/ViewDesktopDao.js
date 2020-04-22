import { ViewDao } from './ViewDao'

class ViewDesktopDao extends ViewDao {
  static add (view) {
    return super.add({
      ...view,
      view_type: 'desktop'
    })
  }

  static addUserDesktop ({ view_name }) {
    return this.add({
      view_name,
      view_title: '自定义',
      protect_level: '0'
    })
  }

  static addGroupDesktop ({ view_name }) {
    return this.add({
      view_name: view_name,
      view_title: `${view_name}桌面`,
      protect_level: '1'
    })
  }

  static batchDelete (where) {
    return super.batchDelete({
      ...where,
      view_type: {
        _eq: 'desktop'
      }
    })
  }

  static batchDeleteUserDesktop (where) {
    return this.batchDelete({
      ...where,
      view_title: { _eq: '自定义' }
    })
  }

  // TODO: api
  static batchDeleteGroupDesktop (where) {
    return this.batchDelete({
      ...where,
      view_title: { _eq: '自定义' }
    })
  }
}

export {
  ViewDesktopDao
}
