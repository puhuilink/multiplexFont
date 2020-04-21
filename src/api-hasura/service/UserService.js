import { label, log } from '../utils/decorator/log'
import { batchMutate, batchQuery } from '../utils/hasura-orm'
import { defaultCreateInfo, defaultUpdateInfo } from '../utils/mixin/autoComplete'
import { AuthorizeObjectDao } from '../dao/AuthorizeObjectDao'
import { UserDao } from '../dao/UserDao'
import { ViewDesktopDao } from '../dao/ViewDesktopDao'
import { UserGroupDao } from '../dao/UserGroupDao'

class UserService {
  @log
  @label('新增用户')
  /**
   * 新增用户
   * @param {Array<String>} userIdList
   * @return {Promise<any>}
   */
  static async add ({ ...argus }) {
    const { user_id = '', phone = '', mobile_phone = '', email = '' } = argus
    // FIMXE: single query with or
    await batchQuery(
      // 检测用户名是否可用
      UserDao.find({ where: { user_id: { _eq: user_id } } }),
      // 检测手机号是否可用
      UserDao.find({ where: { phone: { _eq: phone } } }),
      // 检测移动电话是否可用
      UserDao.find({ where: { mobile_phone: { _eq: mobile_phone } } }),
      // 检测邮箱是否可用
      UserDao.find({ where: { email: { _eq: email } } })
    )

    await batchMutate(
      // 新建用户
      UserDao.add({ ...argus, ...defaultCreateInfo() }),
      // 新建用户自定义桌面
      ViewDesktopDao.add({ user_id })
    )
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

  static async update (argus) {
    defaultUpdateInfo()
  }
}

export {
  UserService
}
