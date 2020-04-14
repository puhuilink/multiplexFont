import apollo from '@/utils/apollo'
import { groupAuthViewList } from '../graphql/ViewGroup'

export const getViewListInGroupAuth = async function (groupId) {
  return apollo.clients.alert.query({
    query: groupAuthViewList,
    variables: {
      groupId
    }
  })
}
