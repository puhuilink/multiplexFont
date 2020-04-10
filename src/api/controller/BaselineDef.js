import apollo from '@/utils/apollo'

import {
  queryBaselineDefList,
  queryResourceInfo,
  // eslint-disable-next-line
  mutationUpdateBaselineDef
} from '../graphql/BaselineDef'

export const getBaselineDefList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryBaselineDefList,
    variables: {
      ...variables
    }
  })
}

export const addBaselintDef = function (object) {

}

export const editBaselineDef = async function (uuid, { kpi, ci, model, ...set }) {
  // 获取 ci、kpi、model 等关联冗余信息
  const { data } = await apollo.clients.resource.query({
    query: queryResourceInfo,
    variables: {
      'modelName': model,
      // FIMXE: 如果长度为0，则会查询出所有
      'insatnceList': ci,
      'kpiCodeList': kpi
    }
  })
  const mapLabel = (arr) => arr.map(({ label }) => label).join(',')
  set = {
    ...set,
    'ci_type_name': model,
    'ci_type_label': mapLabel(data.model),
    'kpi_code': kpi.join(','),
    'kpi_label': mapLabel(data.kpi),
    'ci_id': ci.join(','),
    'ci_label': mapLabel(data.ci)
  }
  return apollo.clients.alert.mutate({
    mutation: mutationUpdateBaselineDef,
    variables: {
      uuid,
      set
    }
  })
}
