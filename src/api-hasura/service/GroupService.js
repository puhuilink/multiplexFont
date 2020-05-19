import { BaseService } from './BaseService'
import {
  GroupDao,
  ViewDesktopDao
} from '../dao/index'
import { query, mutate } from '../utils/hasura-orm/index'

class GroupService extends BaseService {
  static async find (argus = {}) {
    const res = await query(
      GroupDao.find(argus)
    )
    return res
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
}

export {
  GroupService
}
