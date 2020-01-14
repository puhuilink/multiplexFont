import apollo from '@/utils/apollo'
import { List, instanceList } from '../model/resource.graphql'

// TODO: apollo.config.js
// TODO: 中间件 + 拦截
// TODO: error throw
export default class Resource {
  static query (variables = {}) {
    return apollo.clients.ngecc.query({
      query: List,
      variables: {
        ...variables
      }
    }).then(r => r.data)
  }

  static instanceList (variables = {}) {
    console.log(variables)
    return apollo.clients.ngecc.query({
      query: instanceList,
      variables
    }).then(r => r.data)
  }
}
