import { BaseService } from './BaseService'
import { generateMutation, generateQuery, query } from '../utils/hasura-orm/index'
import { UserGroupDao } from '../dao/index'
import { USER_ROLE } from '@/tables/user_group/enum'
import _ from 'lodash'

class UserGroupService extends BaseService {
  static async find (argus) {
    const q = await generateQuery(
      UserGroupDao.find(argus)
    )
    return this.hasuraTransfer({ query: q })
  }

  static async allocateAdmin (group_id, userIds) {
    const q = await generateMutation(
      // 全量删除之前的分配关系
      UserGroupDao.update({
        user_role: USER_ROLE.user
      }, { group_id: { _eq: group_id } }),
      // 全量写入现在的分配关系
      UserGroupDao.update({ user_role: USER_ROLE.administrator }, {
        user_id: { _in: userIds },
        group_id: { _eq: group_id }
      })
    )
    await this.hasuraTransfer({ query: q })
  }

  static async findUserByGroup (group) {
    const { data: { user } } = await query(
      UserGroupDao.find({
        where: { group_id: { _eq: group } },
        fields: [
          'user { staff_name user_id }'
        ],
        alias: 'user'
      })
    )
    return _.uniqBy(user.filter(el => el.user != null).map(el => el.user), 'user_id')
  }

  /**
   * 分配工作组下的用户
   * @param {*} group_id
   * @param {*} userIds
   */
  static async allocateGroupUsers (group_id, userIds) {
    const q = await generateMutation(
      // 全量删除旧用户
      UserGroupDao.batchDelete({ group_id: { _eq: group_id } }),

      // // 全量删除新用户
      UserGroupDao.batchAdd(
        userIds.map(user_id => ({ group_id, user_id, user_role: USER_ROLE.user }))
      )
    )
    await this.hasuraTransfer({ query: q })
  }

  /**
   * 分配用户的工作组
   * @param {*} user_id
   * @param {*} groupIds
   */
  static async allocateUserGroups (user_id, groupIds) {
    const q = await generateMutation(
      // 全量删除旧用户
      UserGroupDao.batchDelete({ user_id }),
      // 全量删除新用户
      UserGroupDao.batchAdd(
        groupIds.map(group_id => ({ group_id, user_id, user_role: USER_ROLE.user }))
      )
    )
    await this.hasuraTransfer({ query: q })
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
