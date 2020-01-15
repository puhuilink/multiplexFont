import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import { List, instanceList } from '../model/resource.graphql'

// TODO: apollo.config.js
// TODO: 中间件 + 拦截
// TODO: error throw
export default class Resource {
  static query (variables = {}) {
    return apollo.clients.resource.query({
      query: List,
      variables: {
        ...variables
      }
    }).then(r => r.data)
  }

  static instanceList (variables = {}) {
    console.log(variables)
    return apollo.clients.resource.query({
      query: instanceList,
      variables
    }).then(r => r.data)
  }
}

export const query = argus => gql`
  query ($parentname_s: String!, $limit: Int! = 0, $offset: Int! = 10, $orderBy: [ngecc_instance_order_by!]) {
    pagination: ngecc_instance_aggregate(where: {parentname_s: {_eq: $parentname_s}}) {
      aggregate {
        count
      }
    }
    data: ngecc_instance(offset: $offset, limit: $limit, where: {parentname_s: {_eq: $parentname_s}}, order_by: $orderBy) {
      _class_s
      _id_s
      createtime_t
      creator_s
      label_s
      name_s
      parentname_s
      parenttree_s
      permissionallowextend_b
      updatetime_t
      updator_s
      values_e
      version_i
    }
  }`
