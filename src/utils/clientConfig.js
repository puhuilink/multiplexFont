import { HttpLink } from 'apollo-link-http'
// import { BatchHttpLink } from 'apollo-link-batch-http'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { notification } from 'ant-design-vue'
import { onError } from 'apollo-link-error'

// FIXME: 此处部分设备无法访问
const linkList = ['28071', '28072', '28073', '28074'].map(port => new HttpLink({
  //   hasura接口对应地址：
  // http://10.1.8.177:8071/v1/graphql，对应https://10.1.8.176:28071
  // http://10.1.8.177:8072/v1/graphql，对应https://10.1.8.176:28072
  // http://10.1.8.177:8073/v1/graphql，对应https://10.1.8.176:28073
  // http://10.1.8.177:8074/v1/graphql，对应https://10.1.8.176:28074
  uri: `https://10.1.8.176:${port}`,
  headers: {
    'x-hasura-admin-secret': port === '28073' ? 'myadminsecretkey' : 'zhongjiao'
  }
}))

// const linkList = ['8071', '8072', '8073', '8074'].map(port => new HttpLink({
//   uri: `http://10.1.8.177:${port}/v1/graphql`,
//   // uri: port === '8072' ? 'https://10.1.8.177:28081/' : `http://10.1.8.177:${port}/v1/graphql`,
//   headers: {
//     'x-hasura-admin-secret': port === '8073' ? 'myadminsecretkey' : 'zhongjiao'
//   }
// }))

const errorHandler = onError(({ networkError, graphQLErrors }) => {
  console.log({ graphQLErrors, networkError })
  if (networkError && networkError.statusCode === 401) {
    notification.error({
      message: '系统异常',
      description: '请检查网络连接是否正常'
    })
    // TODO: throw error
  }
  if (graphQLErrors) {
    notification.error({
      message: '系统内部异常',
      description: graphQLErrors.map(({ message, extensions: { path, code } }) => {
        const text = `[GraphQL error]: Message: ${message}, Code: ${code}, Path: ${path}`
        console.log(text)
        return text
      }).join('/\r/\n')
    })
    // throw new Error(graphQLErrors)
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
  console.log(operation)
  // debugger
  return forward(operation)
})

const addDatesLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    response.data.lastLoginDate = new Date()
    return response
  })
})

const clientList = linkList.map(link => new ApolloClient({
  // 顺序很重要？
  // 原理是中间件？
  link: ApolloLink.from([
    errorHandler,
    middlewareLink,
    addDatesLink,
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
