import { BaseService } from './BaseService'
// import { actionname, moduleName } from '../utils/decorator/log'
import { mutate, query } from '../utils/hasura-orm/index'
import {
  AuthorizeObjectDao,
  FunctionDao,
  UserDao,
  UserGroupDao,
  ViewDesktopDao
} from '../dao/index'
import { setInitialPwd } from '@/api/controller/User'
import store from '@/store'
import _ from 'lodash'
import { OBJECT_TYPE } from '../dao/types/AuthorizeObject'

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
    await setInitialPwd(user.user_id)
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

  static async getAllPermission () {
    // 当前用户信息
    const { groupIdList, userId } = store.getters

    const { data: { authorizeObjectList } } = await query(
      AuthorizeObjectDao.find({
        where: {
          _or: [
            {
              // 工作组权限
              group_id: {
                _in: groupIdList
              }
            },
            {
              // 个人权限
              user_id: {
                _eq: userId
              }
            }
          ],
          object_type: {
            _in: [
              OBJECT_TYPE.button,
              OBJECT_TYPE.menu
            ]
          }
        },
        fields: [
          'object_id'
        ],
        alias: 'authorizeObjectList'
      })
    )
    // 用户权限等于自身权限 + 所属工作组权限的并集
    const permissionList = _.uniq(authorizeObjectList.map(({ object_id }) => object_id)).filter(Boolean)

    if (_.isEmpty(permissionList)) {
      return []
    }

    // 根据权限获取按钮名称等信息
    const { data: { allPermissionList } } = await query(
      FunctionDao.find({
        where: {
          code: {
            _in: permissionList
          }
        },
        fields: [
          'code',
          'name',
          'parentCode: parent_code'
        ],
        alias: 'allPermissionList'
      })
    )

    return allPermissionList
  }
}

export {
  UserService
}
