import apollo from '@/utils/apollo'
import { groupAuthViewList, userAuthViewList } from '../graphql/ViewGroup'

export const getViewListInGroupAuth = async function (groupId) {
  return apollo.clients.alert.query({
    query: groupAuthViewList,
    variables: {
      groupId
    }
  })
}

export const getViewListInUser = async function (userId) {
  return apollo.clients.alert.query({
    query: userAuthViewList,
    variables: {
      userId
    }
  })
}
