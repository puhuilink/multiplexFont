import apollo from '@/utils/apollo'
import {
  queryRouteList,
  queryPlanList
} from '../graphql/patrol'

export const getRouteList = function (variables = {}) {
  return apollo.clients.patrol.query({
    query: queryRouteList,
    variables: {
      ...variables
    }
  })
}

export const getPlanList = function (variables = {}) {
  return apollo.clients.patrol.query({
    query: queryPlanList,
    variables: {
      ...variables
    }
  })
}
