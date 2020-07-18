import { BaseService } from './BaseService'
import {
  GroupDao,
  ViewDesktopDao,
  UserGroupDao,
  AuthorizeObjectDao
} from '../dao/index'
import { query, mutate } from '../utils/hasura-orm/index'

class GroupService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      GroupDao.find(argus)
    )
    return res
  }

  // FIXME: 目前未确定数据表具体标识字段
  static async patrolFind ({ where = {}, ...rest } = {}) {
    return query(
      GroupDao.find({
        where: {
          ...where,
          ascription: {
            _in: ['MachineRoom-XM-DH', 'MachineRoom-XM-IT']
          }
        },
        ...rest
      })
    )
  }

  static async add (group = {}) {
    const { group_id: view_name } = group
    await mutate(
      // 新建工作组
      GroupDao.add(group),
      // 新建工作组视图桌面
      ViewDesktopDao.addGroupDesktop({ view_name })
    )
  }

  static async update (group = {}, where = {}) {
    await mutate(
      GroupDao.update(group, where)
    )
  }

  static async batchDelete (groupIdList = []) {
    const desktopList = groupIdList.map(id => `${id}桌面`)
    await mutate(
      // 工作组删除
      GroupDao.batchDelete({ group_id: { _in: groupIdList } }),
      // 工作组下分配的用户解除关联
      UserGroupDao.batchDelete({ group_id: { _in: groupIdList } }),
      // 工作组分配的权限解除关联
      AuthorizeObjectDao.batchDelete({ group_id: { _in: groupIdList } }),
      // 工作组的桌面删除
      ViewDesktopDao.batchDelete({ view_name: { _in: groupIdList }, view_title: { _in: desktopList } })
    )
  }

  static async toggleFlag (group_id, flag) {
    await mutate(
      GroupDao.toggleFlag(group_id, flag)
    )
  }
}

export {
  GroupService
}
