import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { notification } from 'ant-design-vue'
import { onError } from 'apollo-link-error'

const {
  NODE_ENV,
  VUE_APP_HASURA_IMP_URI
  // VUE_APP_HASURA_IMP_KEY
} = process.env

const linkList = [
  new HttpLink({
    uri: `${VUE_APP_HASURA_IMP_URI}/graphql`
    // headers: { 'x-hasura-admin-secret': VUE_APP_HASURA_IMP_KEY }
  })
]

export const notifyGraphQLError = (graphQLErrors) => {
  notification.error({
    message: '系统内部异常',
    description: graphQLErrors.map(({ message, extensions: { path, code } }) => {
      const text = `[GraphQL error]: Message: ${message}, Code: ${code}, Path: ${path}`
      return text
    }).join('/\r/\n')
  })
}

const errorHandler = onError(({ networkError, graphQLErrors }) => {
  if (networkError) {
    notification.error({
      message: '系统提示',
      description: '请检查网络连接是否正常'
    })
  }
  if (graphQLErrors) {
    notifyGraphQLError(graphQLErrors)
  }
})

const defaultOptions = {
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
}

const middlewareLink = new ApolloLink((operation, forward) => forward(operation))

const clientList = linkList.map(link => new ApolloClient({
  link: ApolloLink.from(
    [
      ...NODE_ENV === 'development' ? [errorHandler] : [],
      middlewareLink,
      link
    ]
  ),
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: defaultOptions
}))

// imp 数据库 hasura
const [imp] = clientList

export { imp }
