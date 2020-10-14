import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
// import { notification } from 'ant-design-vue'
// import { onError } from 'apollo-link-error'

const {
  NODE_ENV,
  VUE_APP_HASURA_IMP_URI,
  VUE_APP_HASURA_IMP_KEY
} = process.env

const linkList = [
  new HttpLink({ uri: `${VUE_APP_HASURA_IMP_URI}/v1/graphql`, headers: { 'x-hasura-admin-secret': VUE_APP_HASURA_IMP_KEY } })
]

if (NODE_ENV === 'development') {
  // TODo
}

// TODO: 此处包装后传递到 service 层
// const errorHandler = onError(({ networkError, graphQLErrors }) => {
//   // console.log({ graphQLErrors, networkError })
//   if (networkError) {
//     notification.error({
//       message: '系统提示',
//       description: '请检查网络连接是否正常'
//     })
//   }
//   // 确保只在 dev 环境下提示
//   if (graphQLErrors) {
//     notification.error({
//       message: '系统内部异常',
//       description: graphQLErrors.map(({ message, extensions: { path, code } }) => {
//         const text = `[GraphQL error]: Message: ${message}, Code: ${code}, Path: ${path}`
//         // console.log(text)
//         return text
//       }).join('/\r/\n')
//     })
//     // TODO: throw error
//   }
// })

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
  // 中间件需要按顺序设置
  link: ApolloLink.from([
    // errorHandler,
    middlewareLink,
    // addDatesLink,
    link
  ]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: defaultOptions
}))

const [imp] = clientList

export {
  imp
}
