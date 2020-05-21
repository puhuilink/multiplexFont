import { ViewDao } from './ViewDao'

class ViewDesktopDao extends ViewDao {
  static async add (view) {
    return super.add({
      ...view,
      view_type: 'desktop'
    })
  }

  static async addUserDesktop ({ view_name }) {
    return this.add({
      view_name,
      view_title: '自定义',
      protect_level: '0'
    })
  }

  static async addGroupDesktop ({ view_name }) {
    return this.add({
      view_name: view_name,
      view_title: `${view_name}桌面`,
      protect_level: '1'
    })
  }

  static async batchDelete (where) {
    return super.batchDelete({
      ...where,
      view_type: {
        _eq: 'desktop'
      }
    })
  }

  static async batchDeleteUserDesktop () {}

  static async batchDeleteGroupDesktop () {}
}

export {
  ViewDesktopDao
}
