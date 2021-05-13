import { BaseService } from './BaseService'
import {
  GroupDao,
  ViewDesktopDao,
  UserGroupDao,
  AuthorizeObjectDao
} from '../dao/index'
import { generateQuery, generateMutation } from '../utils/hasura-orm/index'

class GroupService extends BaseService {
  static async find (argus = {}) {
    const q = await generateQuery(
      GroupDao.find(argus)
    )
    return this.hasuraTransfer({ query: q })
  }

  // FIXME: 目前未确定数据表具体标识字段
  static async patrolFind ({ where = {}, ...rest } = {}) {
    const q = await generateQuery(
      GroupDao.find({
        where: {
          ...where
        },
        ...rest
      })
    )
    return this.hasuraTransfer({ query: q })
  }

  static async add (group = {}) {
    const q = await generateMutation(
      // 新建工作组
      GroupDao.add(group)
    )
    await this.hasuraTransfer({ query: q })
  }

  static async update (group = {}, where = {}) {
    const q = await generateMutation(
      GroupDao.update(group, where)
    )
    await this.hasuraTransfer({ query: q })
  }

  static async batchDelete (groupIdList = []) {
    const q = await generateMutation(
      // 工作组删除
      GroupDao.batchDelete({ group_id: { _in: groupIdList } }),
      // 工作组下分配的用户解除关联
      UserGroupDao.batchDelete({ group_id: { _in: groupIdList } }),
      // 工作组分配的权限解除关联
      AuthorizeObjectDao.batchDelete({ group_id: { _in: groupIdList } }),
      // 工作组的桌面删除
      ViewDesktopDao.batchDeleteGroupDesktop({ group_id: { _in: groupIdList } })
    )
    await this.hasuraTransfer({ query: q })
  }

  static async toggleFlag (group_id, flag) {
    const q = await generateMutation(
      GroupDao.toggleFlag(group_id, flag)
    )
    await this.hasuraTransfer({ query: q })
  }
}

export {
  GroupService
}
