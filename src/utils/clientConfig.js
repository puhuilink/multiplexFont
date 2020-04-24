import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { notification } from 'ant-design-vue'
import { onError } from 'apollo-link-error'

// FIXME: 此处部分设备无法访问到数据，可能与 https 协议有关，与运维联系
const linkList = ['28079', '28078', '28077', '28076'].map(port => new HttpLink({
  //   hasura接口对应地址：
  // http://10.1.13.17:31377/v1/graphql，对应https://10.1.8.176:28076
  // http://10.1.13.17:32495/v1/graphql，对应https://10.1.8.176:28077
  // http://10.1.13.17:31490/v1/graphql，对应https://10.1.8.176:28078
  // http://10.1.13.17:31588/v1/graphql，对应https://10.1.8.176:28079
  uri: `https://10.1.8.176:${port}`,
  headers: {
    'x-hasura-admin-secret': port === '28077' ? 'myadminsecretkey' : 'zhongjiao'
  }
}))

// TODO: 此处包装后传递到 service 层
const errorHandler = onError(({ networkError, graphQLErrors }) => {
  console.log({ graphQLErrors, networkError })
  if (networkError) {
    notification.error({
      message: '系统提示',
      description: '请检查网络连接是否正常'
    })
  }
  // 确保只在 dev 环境下提示
  if (graphQLErrors) {
    notification.error({
      message: '系统内部异常',
      description: graphQLErrors.map(({ message, extensions: { path, code } }) => {
        const text = `[GraphQL error]: Message: ${message}, Code: ${code}, Path: ${path}`
        console.log(text)
        return text
      }).join('/\r/\n')
    })
    // TODO: throw error
  }
})

const defaultOptions = {
  // watchQuery: {
  //   fetchPolicy: 'no-cache',
  //   errorPolicy: 'ignore',
  // },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
}

const middlewareLink = new ApolloLink((operation, forward) => {
  // operation.setContext({
  //   headers: {
  //     authorization: localStorage.getItem('token') || null
  //   }
  // })
  // console.log(operation)
  // debugger
  return forward(operation)
})

// const addDatesLink = new ApolloLink((operation, forward) => {
//   return forward(operation).map(response => {
//     response.data.lastLoginDate = new Date()
//     return response
//   })
// })

const clientList = linkList.map(link => new ApolloClient({
  // 顺序很重要？
  // 原理是中间件？
  link: ApolloLink.from([
    errorHandler,
    middlewareLink,
    // addDatesLink,
    link
  ]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: defaultOptions
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
