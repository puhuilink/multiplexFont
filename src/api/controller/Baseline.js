import apollo from '@/utils/apollo'

import { queryBaselineDefList } from '../graphql/Baseline'

export const getBaseLineDefList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryBaselineDefList,
    variables: {
      ...variables
    }
  })
}
