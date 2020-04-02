import apollo from '@/utils/apollo'
import { varcharUuid } from '@/utils/util'
import { insert, update, queryLastestId } from '../graphql/ModelRelationAttr'

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

export const addModelRelationAttr = async function (sourceS, value = {}) {
  const did = await fetchLastestId() + 1
  return apollo.clients.resource.mutate({
    mutation: insert,
    variables: {
      objects: [
        {
          ...value,
          did,
          _id_s: varcharUuid(),
          'source_s': sourceS
        }
      ]
    }
  }).then(r => r.data)
}

export const updateModelRelationAttr = function (did, value = {}) {
  return apollo.clients.resource.mutate({
    mutation: update,
    variables: {
      did: did,
      object: {
        ...value
      }
    }
  }).then(r => r.data)
}
