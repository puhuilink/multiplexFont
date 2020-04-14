import apollo from '@/utils/apollo'
import {
  queryGroupByUserId
} from '../graphql/UserGroup'

/**
 * @abort
 * 登录接口已返回用户组信息，该接口废弃
 * @param {*} userId
 */
export const getGroupInfoByUserId = function (userId) {
  return apollo.clients.alert.query({
    query: queryGroupByUserId,
    variables: {
      userId
    }
  }).then(r => r.data.data.map(({ group }) => group))
}
