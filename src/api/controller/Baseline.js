import apollo from '@/utils/apollo'

import { queryBaselineDefList, queryAllBaselineStrategyList } from '../graphql/Baseline'

export const getBaselineDefList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryBaselineDefList,
    variables: {
      ...variables
    }
  })
}

export const getAllBaselineStrategyList = function () {
  return apollo.clients.alert.query({
    query: queryAllBaselineStrategyList
  }).then(r => r.data)
}
