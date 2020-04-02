import apollo from '@/utils/apollo'
// import gql from 'graphql-tag'
import { parse } from 'graphql'

export const getKpiList = function (query) {
  // eslint-disable-next-line
  return apollo.clients.cache.query({
    // gql 不可用于动态构建
    // https://github.com/apollographql/graphql-tag/issues/267
    // query: gql`query`
    query: parse(query)
  }).then(r => r.data)
}
