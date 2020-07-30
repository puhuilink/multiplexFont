import { BaseService } from './BaseService'
// import { actionname, moduleName } from '../utils/decorator/log'
import { mutate, query } from '../utils/hasura-orm/index'
import {
  AuthorizeObjectDao,
  UserDao,
  UserGroupDao,
  ViewDesktopDao
} from '../dao/index'
import { setInitialPwd } from '@/api/controller/User'

// @moduleName('用户模块')
class UserService extends BaseService {
  // @actionname('新增用户')
  /**
   * 新增用户
   * @param {Object} user
   * @return {Promise<any>}
   */
  static async add (user = {}) {
    await mutate(
      // 新增用户
      UserDao.add(user),
      // 新增用户自定义桌面
      ViewDesktopDao.addUserDesktop({ view_name: user['user_id'] })
    )
    // FIXME: 接口报错用户不存在？
    // await setInitialPwd(user.id)
  }

  static async find (argus = {}) {
    const res = query(
      UserDao.find(argus)
    )
    return res
  }

  // @actionname('删除用户')
  /**
   * 删除用户
   * @param {Array<String>} userIdList
   * @return {Promise<any>}
   */
  static async batchDelete (userIdList = []) {
    await mutate(
      // 删除用户
      UserDao.batchDelete({ user_id: { _in: userIdList } }),
      // 删除用户自定义桌面
      ViewDesktopDao.batchDelete({ view_name: { _in: userIdList } }),
      // 删除用户与用户组关联
      UserGroupDao.batchDelete({ user_id: { _in: userIdList } }),
      // 删除用户的权限
      AuthorizeObjectDao.batchDelete({ user_id: { _in: userIdList } })
      // 审计日志
    )
  }

  static async update (user, where) {
    await mutate(
      UserDao.update(user, where)
    )
  }

  static async toggleFlag (user_id, flag) {
    await mutate(
      // TODO: UserDao toggleFlag method
      UserDao.update({ flag }, { user_id })
    )
  }
}

export {
  UserService
}
