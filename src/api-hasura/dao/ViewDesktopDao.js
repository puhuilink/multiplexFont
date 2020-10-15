import { BaseDao } from './BaseDao'
import { imp } from '../config/client'
import { readonly } from 'core-decorators'

class ViewDesktopDao extends BaseDao {
  // 对应 hasura schema
  @readonly
  static SCHEMA = 't_view_desktop'

  // 对应 vue-apollo
  @readonly
  static PROVIDER = imp

  static async addUserDesktop (desktop) {
    return this.add({
      ...desktop,
      type: 'user'
    })
  }

  static async batchAddUserDesktop (desktops = []) {
    return super.batchAdd(
      desktops.map(el => ({ ...el, type: 'user' }))
    )
  }

  static async addGroupDesktop (desktop) {
    return this.add({
      ...desktop,
      type: 'group'
    })
  }

  static async batchAddGroupDesktop (desktops = []) {
    return super.batchAdd(
      desktops.map(el => ({ ...el, type: 'group' }))
    )
  }

  static async batchDelete (where) {
    return super.batchDelete({
      ...where
    })
  }

  static async batchDeleteUserDesktop (where) {
    return this.batchDelete(({
      ...where,
      type: 'user'
    }))
  }

  static async batchDeleteGroupDesktop (where) {
    return this.batchDelete(({
      ...where,
      type: 'group'
    }))
  }
}

export {
  ViewDesktopDao
}
