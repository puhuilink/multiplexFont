import apollo from '@/utils/apollo'
import { groupAuthViewList, userAuthViewList, administratorAuthViewList } from '../graphql/ViewGroup'

export const getViewListInGroupAuth = async function (groupId) {
  return apollo.clients.alert.query({
    query: groupAuthViewList,
    variables: {
      groupId
    }
  })
}

export const getViewListInUserAuth = async function (userId) {
  return apollo.clients.alert.query({
    query: userAuthViewList,
    variables: {
      userId
    }
  })
}

export const getViewListInAdministratorAuth = async function () {
  return apollo.clients.alert.query({
    query: administratorAuthViewList
  })
}
