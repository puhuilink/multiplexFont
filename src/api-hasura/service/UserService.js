import { BaseService } from './BaseService'
import { label, log } from '../utils/decorator/log'
import { batchMutate } from '../utils/hasura-orm'
import { AuthorizeObjectDao } from '../dao/AuthorizeObjectDao'
import { UserDao } from '../dao/UserDao'
import { ViewDesktopDao } from '../dao/ViewDesktopDao'
import { UserGroupDao } from '../dao/UserGroupDao'

class UserService extends BaseService {
  @log
  @label('新增用户')
  /**
   * 新增用户
   * @param {Objetc} user
   * @return {Promise<any>}
   */
  static async add (user = {}) {
    try {
      await this.uniqueValidate(user, UserDao)
      await batchMutate(
        // 新建用户
        UserDao.add(user)
        // TODO
        // 新建用户自定义桌面
        // ViewDesktopDao.add({ user_id: user['user_id'], view_title: '自定义' })
      )
    } catch (e) {
      throw e
    }
  }

  @log
  @label('删除用户')
  /**
   * 删除用户
   * @param {Array<String>} userIdList
   * @return {Promise<any>}
   */
  static async batchDelete (userIdList = []) {
    await batchMutate(
      // 删除用户
      UserDao.batchDelete({ user_id: { _in: userIdList } }),
      // 删除用户自定义桌面
      ViewDesktopDao.batchDelete({ view_title: { _eq: '自定义' }, view_name: { _in: userIdList } }),
      // 删除用户与用户组关联
      UserGroupDao.batchDelete({ user_id: { _in: userIdList } }),
      // 删除用户的权限
      AuthorizeObjectDao.batchDelete({ user_id: { _in: userIdList } })
      // 审计日志
    )
  }

  static async update (user) {
    await this.uniqueValidate(user, UserDao, false)
    await UserDao.update(user).mutate()
  }
}

export {
  UserService
}
