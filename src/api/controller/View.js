import apollo from '@/utils/apollo'
import { mutationUpdateView, queryViewList } from '../graphql/View'

// TODO: default value
export const getViewList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryViewList,
    variables
  })
}

export const updateView = function (viewId, set = {}) {
  // TODO: 字段校验 与 error catch + notification
  if (!viewId) {
    throw new Error('view_id 缺失')
  }
  return apollo.clients.alert.mutate({
    mutation: mutationUpdateView,
    variables: {
      viewId,
      set
    }
  })
}
