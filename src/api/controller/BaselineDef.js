import apollo from '@/utils/apollo'

import { queryBaselineDefList } from '../graphql/BaselineDef'

export const getBaselineDefList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryBaselineDefList,
    variables: {
      ...variables
    }
  })
}
