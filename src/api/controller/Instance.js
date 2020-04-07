import apollo from '@/utils/apollo'
import {
  insertInstance,
  updateInstance,
  queryLastestId,
  queryInstanceList
} from '../graphql/Instance'
import { varcharUuid } from '@/utils/util'
import store from '@/store'

/**
 * 获取最新数据id，用于数据表自增
 * TODO: 数据迁移期间，无法设置pg主键自增，迁移结束后可考虑调整该处
 * @return {Promise<Number>}
 */
const fetchLastestId = function () {
  return apollo.clients.resource.query({
    query: queryLastestId
  }).then(r => r.data.data.aggregate.max.did)
}

const addInstances = function (values) {
  // TODO: 表单默认值？
  return apollo.clients.resource.mutate({
    mutation: insertInstance,
    variables: {
      objects: values
    }
  })
}

export const addInstance = async function (Value) {
  const did = await fetchLastestId() + 1
  return addInstances([{
    ...Value,
    did,
    _id_s: varcharUuid(),
    creator_s: store.state.user.name,
    updator_s: store.state.user.name
  }])
}

export const editInstance = function (did, value) {
  return apollo.clients.resource.mutate({
    mutation: updateInstance,
    variables: {
      where: {
        'did': {
          '_eq': did
        }
      },
      val: {
        ...value
      }
    }
  })
}

export const getInstanceList = function (variables) {
  return apollo.clients.resource.query({
    query: queryInstanceList,
    variables
  })
}
