import apollo from '@/utils/apollo'
import { queryViewList } from '../graphql/View'

// TODO: default value
export const getViewList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryViewList,
    variables
  })
}
