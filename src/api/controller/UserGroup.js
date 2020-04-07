import apollo from '@/utils/apollo'
import {
  queryGroupByUserId
} from '../graphql/UserGroup'

export const getGroupInfoByUserId = function (userId) {
  return apollo.clients.alert.query({
    query: queryGroupByUserId,
    variables: {
      userId
    }
  }).then(r => r.data.data.map(({ group }) => group))
}
