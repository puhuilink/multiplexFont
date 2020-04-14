import apollo from '@/utils/apollo'
import { groupAuthViewList } from '../graphql/ViewGroup'

export const getViewListInGroupAuth = async function (groupId) {
  return apollo.clients.alert.query({
    // operationName: 'getViewListInGroupAuth',
    query: groupAuthViewList,
    variables: {
      groupId
    }
  })
}
