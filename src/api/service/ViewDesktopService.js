import { BaseService } from './BaseService'
import { mutate, query } from '../utils/hasura-orm/index'
import { ViewDesktopDao, UserDao, GroupDao } from '../dao/index'
import { UserGroupService } from './UserGroupService'

class ViewDesktopService extends BaseService {
  static async find (argus) {
    return query(
      ViewDesktopDao.find(argus)
    )
  }

  /**
   * 获取一个用户能访问到的所有桌面配置
   * @param {String} user_id
   */
  static async availableDesktop (user_id) {
    const groupIdList = await UserGroupService.availableGroupIdListByUserId(user_id)
    const snippet = [
      `viewDesktops {
        view {
          view_id
          view_title
          view_img
          createdate
        }
      }`
    ]
    const { data: { userDesktopConfig, groupDesktopConfig } } = await query(
      // 用户信息与桌面配置
      UserDao.find({
        where: { user_id },
        fields: [
          ...snippet,
          'user_id',
          'staff_name'
        ],
        alias: 'userDesktopConfig'
      }),
      // 工作组信息与桌面配置
      GroupDao.find({
        where: { group_id: { _in: groupIdList } },
        fields: [
          ...snippet,
          'group_id',
          'group_name'
        ],
        alias: 'groupDesktopConfig'
      })
    )
    return {
      userDesktop: userDesktopConfig.map((config) => {
        const views = config.viewDesktops.map(({ view }) => view).filter(Boolean)
        return {
          desktopName: config.staff_name,
          user_id: config.user_id,
          views,
          viewIds: views.map(({ view_id }) => view_id)
        }
      }),
      groupDesktop: groupDesktopConfig.map((config) => {
        const views = config.viewDesktops.map(({ view }) => view).filter(Boolean)
        return {
          desktopName: config.group_name,
          group_id: config.group_id,
          views,
          viewIds: views.map(({ view_id }) => view_id)
        }
      })
    }
  }

  static async updateGroupDesktop (group_id, viewIdList) {
    await mutate(
      // 删除之前桌面配置
      ViewDesktopDao.batchDeleteGroupDesktop({ group_id }),
      // 全量写入新配置
      ViewDesktopDao.batchAddUserDesktop(
        viewIdList.map(view_id => ({ group_id, view_id }))
      )
    )
  }

  static async updateUserDesktop (user_id, viewIdList) {
    await mutate(
      // 删除之前桌面配置
      ViewDesktopDao.batchDeleteGroupDesktop({ user_id }),
      // 全量写入新配置
      ViewDesktopDao.batchAddGroupDesktop(
        viewIdList.map(view_id => ({ user_id, view_id }))
      )
    )
  }
}

export {
  ViewDesktopService
}
