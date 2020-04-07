import apollo from '@/utils/apollo'
import {
  insert,
  update,
  queryLastestId
} from '../graphql/ModelAttr'
import { oldRequest } from '@/utils/oldRequest'
import store from '@/store'

/**
 * 获取最新数据id，用于数据表自增
 * TODO: 数据迁移期间，无法设置pg主键自增，迁移结束后可考虑调整该处
 * @return {Promise<Number>}
 */
const fetchLastestId = function () {
  return apollo.clients.resource.query({
    query: queryLastestId
  }).then(r => r.data.data.aggregate.max.rid)
}

/**
 * 批量增加属性
 * @param {*} values
 * @return {Promise<any>}
 */
export const addModelAttrs = function (values) {
  return apollo.clients.resource.mutate({
    mutation: insert,
    variables: {
      objects: values
    }
  })
}

/**
 * 增加属性
 * @param {*} value
 * @return {Promise<any>}
 */
export const addModelAttr = async function (value) {
  const rid = await fetchLastestId() + 1
  return addModelAttrs([{
    ...value,
    rid
  }])
}

/**
 * 旧系统增加属性
 * @param {*} value
 * @return {Promise<any>}
 */
export const addModelAttrOld = async function (value) {
  // const rid = await fetchLastestId() + 1
  // TODO
  return oldRequest.post('/urmp/api/rest/post/modelService/modelAttributeManager', [])
}

/**
 * 更新属性
 * @param {*} value
 * @return {Promise<any>}
 */
export const updateModelAttr = function (rid, value) {
  return apollo.clients.resource.mutate({
    mutation: update,
    variables: {
      where: {
        'rid': {
          '_eq': rid
        }
      },
      attr: {
        ...value
      }
    }
  })
}

/**
 * 旧系统更新属性
 * @param {*} value
 * @return {Promise<any>}
 */
export const updateModelAttrOld = function (rid, value) {
  // TODO: mapping
  return oldRequest.post('/urmp/api/rest/post/instanceService/update', [
    value,
    store.state.user.info.userId,
    []
  ])
}
