import apollo from '@/utils/apollo'
import { queryResourceModelList } from '../graphql/Resource'

export const getResourceInstanceList = function () {
  return apollo.clients.resource.query({
    query: queryResourceModelList
  }).then(r => r.data)
}
