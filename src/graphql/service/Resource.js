import apollo from '@/utils/apollo'
import { List } from '../model/resource.graphql'

// TODO: apollo.config.js
// TODO: 中间件 + 拦截
// TODO: error throw
export default class Resource {
  static query (varisbles = {}) {
    return apollo.defaultClient.query({
      query: List,
      varisbles
    })
  }
}
