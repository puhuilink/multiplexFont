import { BaseService } from './BaseService'
import { log, moduleName } from '../utils/decorator/log'
import { mutate } from '../utils/hasura-orm/index'
import {
  AuthorizeObjectDao,
  UserDao,
  UserGroupDao,
  ViewDesktopDao
} from '../dao/index'

@moduleName('用户模块')
class UserService extends BaseService {
  @log('新增用户')
  /**
   * 新增用户
   * @param {Objetc} user
   * @return {Promise<any>}
   */
  static async add (user = {}) {
    await mutate(
      // 新建用户
      UserDao.add(user),
      // 新建用户自定义桌面
      ViewDesktopDao.addUserDesktop({ view_name: user['user_id'] })
    )
  }

  @log('删除用户')
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
}

export {
  UserService
}
