import apollo from '@/utils/apollo'
import { groupAuthViewList, userAuthViewList } from '../graphql/ViewGroup'

export const getViewListInGroupAuth = async function (groupId) {
  return apollo.clients.imp.query({
    query: groupAuthViewList,
    variables: {
      groupId
    }
  })
}

export const getViewListInUserAuth = async function (userId) {
  return apollo.clients.imp.query({
    query: userAuthViewList,
    variables: {
      userId
    }
  })
}
