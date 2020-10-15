import { BaseService } from './BaseService'
// eslint-disable-next-line no-unused-vars
import { mutate, query } from '../utils/hasura-orm/index'
import { UserGroupDao } from '../dao/index'

class UserGroupService extends BaseService {
  static async find (argus) {
    return query(
      UserGroupDao.find(argus)
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
