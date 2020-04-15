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
  if (userId === '超级管理员桌面') {
    const { data } = await getViewListInAdministratorAuth()
    // console.log(data.data)
    const [{ content }] = data.data
    // console.log(content)
    return (content || '').split(',')
  }
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
