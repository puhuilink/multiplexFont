import { BaseService } from './BaseService'
import { mutate, query } from '../utils/hasura-orm/index'
import { UserGroupDao } from '../dao/index'
import { USER_ROLE } from '@/composables/user-group/enum'

class UserGroupService extends BaseService {
  static async find (argus) {
    return query(
      UserGroupDao.find(argus)
    )
  }

  static async allocateAdmin (group_id, userIds) {
    await mutate(
      // 全量删除之前的分配关系
      UserGroupDao.update({
        user_role: USER_ROLE.user
      }, { user_id: { _in: userIds } }),
      // 全量写入现在的分配关系
      UserGroupDao.batchAdd(
        ...userIds.map(user_id => ({ group_id, user_id, user_role: USER_ROLE.administrator }))
      )
    )
  }

  /**
   * 分配工作组下的用户
   * @param {*} group_id
   * @param {*} userIds
   */
  static async allocateGroupUser (group_id, userIds) {
    await mutate(
      // 全量删除旧用户
      UserGroupDao.batchDelete({ group_id }),
      // 全量删除新用户
      UserGroupDao.batchAdd(
        ...userIds.map(user_id => ({ group_id, user_id, user_role: USER_ROLE.user }))
      )
    )
  }

  /**
   * 分配用户的工作组
   * @param {*} user_id
   * @param {*} groupIds
   */
  static async allocateUserGroups (user_id, groupIds) {
    await mutate(
      // 全量删除旧用户
      UserGroupDao.batchDelete({ user_id }),
      // 全量删除新用户
      UserGroupDao.batchAdd(
        ...groupIds.map(group_id => ({ group_id, user_id, user_role: USER_ROLE.user }))
      )
    )
  }

  static async availableGroupIdListByUserId (user_id) {
    return this
      .find({
        where: {
          user_id,
          group: {
            flag: { _eq: 1 }
          }
        },
        fields: ['group_id'],
        alias: 'groupList'
      })
      .then(({ data }) => data)
      .then(({ groupList }) => groupList.map(({ group_id }) => group_id))
  }
}

export {
  UserGroupService
}
