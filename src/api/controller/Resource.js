import apollo from '@/utils/apollo'
import {
  mutationUpdateModel,
  mutationInsertModels,
  queryResourceModelList,
  queryModelList,
  queryInsanceList,
  queryKpiList
} from '../graphql/Resource'
import { oldRequest } from '@/utils/oldRequest'
import { modelMapping } from '../mapping/Resource'

export const getResourceInstanceList = function () {
  return apollo.clients.resource.query({
    query: queryResourceModelList
  }).then(r => r.data)
}

export const getModelList = function (withChildren = false) {
  return apollo.clients.resource.query({
    query: queryModelList,
    variables: {
      withChildren
    }
  }).then(r => r.data)
}

export const getInstanceList = function (where = {}) {
  return apollo.clients.resource.query({
    query: queryInsanceList,
    variables: {
      where
    }
  }).then(r => r.data)
}

export const getKpiList = function (where = {}) {
  return apollo.clients.resource.query({
    query: queryKpiList,
    variables: {
      where: {
        ...where,
        'parentname_s': {
          '_eq': 'Kpi'
        }
      }
    }
  }).then(r => r.data)
}

/**
 * 更新模型
 * @param {Number} did 主键
 * @param {Objetc} set 增量内容
 */
export const editModel = function (did, set = {}) {
  // return apollo.clients.resource.mutate({
  //   mutation: mutationUpdateModel,
  //   variables: {
  //     did,
  //     set
  //   }
  // })
  return editModelOld(did, set)
}

/**
 * 旧系统更新模型
 */
export const editModelOld = function (did, set = {}) {
  const data = {}
  Object.keys(set).forEach(key => {
    if (modelMapping[key]) {
      data[modelMapping[key]] = set[key]
    }
  })
  // const {
  //   name_s: name,
  //   label_s: label,
  //   icon_s: icon,
  //   edit_b: edit,
  //   batch_b: batch,
  //   encrypt_s: encrypt,
  //   order_i: order
  // } = set

  return oldRequest.post('/urmp/api/rest/post/modelService/update', [data, '', []])
}

/**
 * （批量）新增资源模型
 * @param {Array} objects
 * @return {*}
 */
export const addModels = function (objects = []) {
  // TODO: 数据表 did 唯一，是否要（需要）做 name_s 唯一？
  // TODO: 旧的业务逻辑，确实是根据 name_s 唯一的，如何迁移到以 did 构建树？
  // FIXME: 目前的构建树方式，是认为 name_s 唯一的
  return apollo.clients.resource.mutate({
    mutation: mutationInsertModels,
    variables: {
      objects
    }
  })
}

/**
 * 旧系统（批量）新增资源模型
 * @param {Array} objects
 * @return {*}
 */
export const addModelsOld = function (objects = []) {
  // TODO: 数据表 did 唯一，是否要（需要）做 name_s 唯一？
  // TODO: 旧的业务逻辑，确实是根据 name_s 唯一的，如何迁移到以 did 构建树？
  // FIXME: 目前的构建树方式，是认为 name_s 唯一的
  return apollo.clients.resource.mutate({
    mutation: mutationInsertModels,
    variables: {
      objects
    }
  })
}
