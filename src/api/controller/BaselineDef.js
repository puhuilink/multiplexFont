import apollo from '@/utils/apollo'
import uuid from 'uuid/v4'

import {
  queryBaselineDefList,
  queryResourceInfo,
  mutationUpdateBaselineDef,
  mutationAddBaselintDefs
} from '../graphql/BaselineDef'

export const getBaselineDefList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryBaselineDefList,
    variables: {
      ...variables
    }
  })
}

// 获取 ci、kpi、model 等关联冗余信息
const fetchResourceInfo = async function (model, ci, kpi) {
  const { data } = await apollo.clients.resource.query({
    query: queryResourceInfo,
    variables: {
      'modelName': model,
      'insatnceList': ci,
      'kpiCodeList': kpi
    }
  })
  const mapLabel = (arr) => arr.map(({ label }) => label).join(',')
  // debugger
  return {
    'ci_type_name': model,
    'ci_type_label': mapLabel(data.model),
    'kpi_code': kpi.join(','),
    'kpi_label': mapLabel(data.kpi),
    'ci_id': ci.join(','),
    'ci_label': mapLabel(data.ci)
  }
}

export const addBaselintDef = async function ({ kpi, ci, model, ...object }) {
  const resourceInfo = await fetchResourceInfo(model, ci, kpi)
  return apollo.clients.alert.mutate({
    mutation: mutationAddBaselintDefs,
    variables: {
      objects: [{
        ...object,
        ...resourceInfo,
        // 控制长度在33之内（与数据表保持一致）
        uuid: uuid().replace(/-/g, '')
      }]
    }
  })
}

export const editBaselineDef = async function (uuid, { kpi, ci, model, ...set }) {
  const resourceInfo = await fetchResourceInfo(model, ci, kpi)
  /* eslint-disable */
  return apollo.clients.alert.mutate({
    mutation: mutationUpdateBaselineDef,
    variables: {
      uuid,
      set: {
        ...set,
        ...resourceInfo
      }
    }
  })
}
