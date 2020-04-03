import apollo from '@/utils/apollo'
import {
  queryKpiList
} from '../graphql/Kpi'

export const getKpiList = function (variables) {
  return apollo.clients.resource.query({
    query: queryKpiList,
    variables
  })
}
