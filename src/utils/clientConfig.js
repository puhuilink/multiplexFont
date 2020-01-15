import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'

const linkList = ['8071', '8072', '8073', '8074'].map(port => new HttpLink({
  uri: `http://10.1.8.177:${port}/v1/graphql`,
  headers: {
    'x-hasura-admin-secret': 'zhongjiao'
  }
}))

const clientList = linkList.map(link => new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
  connectToDevTools: true
}))

// 缓存
// 告警
// 巡检
// 资源
const [cache, alert, patrol, resource] = clientList

export {
  cache,
  alert,
  patrol,
  resource
}
