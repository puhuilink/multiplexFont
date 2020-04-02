import apollo from '@/utils/apollo'
import moment from 'moment'
import store from '@/store'
import { parse } from 'graphql'
import {
  mutationInsertViews,
  mutationUpdateView,
  queryViewList,
  generateDynamicQueryWithKpiCi,
  queryKpiAndInstanceInfo,
  queryViewContent
} from '../graphql/View'
// import _ from 'lodash'

// TODO: default argus
export const getViewList = function (variables = {}) {
  return apollo.clients.alert.query({
    query: queryViewList,
    variables
  })
}

/**
 * 编辑视图（标题）
 * @param viewId
 * @param set
 * @return {*}
 */
export const updateView = function (viewId, set = {}) {
  // TODO: 字段校验 与 error catch + notification
  if (!viewId) {
    throw new Error('view_id 缺失')
  }
  return apollo.clients.alert.mutate({
    mutation: mutationUpdateView,
    variables: {
      viewId,
      set
    }
  })
}

/**
 * 新建视图（标题）
 * @param {Object} object
 * @return {Promise<any>}
 */
export const addView = function (object = {}) {
  const objects = [
    {
      ...object,
      // FIXME: 此处默认一致？
      'view_name': object.view_name || object.view_title,
      // FIXME: 此处为固定值，重构数据表后不需要此值
      'view_type': 'h5',
      // FIXME: 个人创建为0，组创建为1？
      'protect_level': '1',
      // FIXME: name 还是 id ？
      creator: store.state.user.name,
      // TODO: 放到 hasura webhook 处理？
      createdate: moment().format('YYYY-MM-DDTHH:mm:ss')
    }
  ]
  // return console.log(objects)
  return apollo.clients.alert.mutate({
    mutation: mutationInsertViews,
    variables: {
      objects
    }
  })
}

/**
 * 批量新建视图（标题）
 * @param {Array<Object>>} objects
 * @return {Promise<any>}
 */
export const addViews = function (objects = {}) {
  if (objects.length === 0) {
    throw new Error('参数为空')
  }
  return apollo.clients.alert.mutate({
    mutation: mutationInsertViews,
    variables: {
      objects
    }
  })
}

/**
 * 视图配置详情
 * @param {String} viewId
 * @return {Promise<String>}
 */
export const getViewDesign = async function (viewId) {
  return apollo.clients.alert.query({
    query: queryViewContent,
    variables: {
      viewId: Number(viewId)
    }
  })
    .then(r => r.data.data)
    .then(([item]) => item || {})
    .then(({ content }) => JSON.parse(content))
    .then(content => {
      // 老系统视图没有 id 字段
      if (content && content.id) {
        return content
      } else {
        throw new Error('老系统视图，将返回空画布')
      }
    })
    .catch(err => Promise.reject(err))
}

/**
 * 更新视图配置
 * @return {Promise<any>}
 */
export const updateViewDesign = async function () {}

/**
 * 根据传入的 [instance_id_s] 批量获取其基础信息
 * @param {*} instanceIdList
 * @return {Promise<any>}
 */
const getKpiAndInstanceList = ({ selectedKpi: kpiCodeList, selectedInstance: instanceIdList }) => {
  return apollo.clients.resource.query({
    query: queryKpiAndInstanceInfo,
    variables: {
      instanceIdList,
      kpiCodeList
    }
  }).then(r => r.data)
}

/**
 * 组合 Kpi 数组与 Ci 数组为一一匹配的一维数组
 * 假设有两条kpi、两条Ci，应当组合为长度为4的数组
 * 用于视图组件查询拼接查询语句
 * @param {Object} param0
 * @return {Array<Object>}
 */
const compose = ({ selectedKpi, selectedInstance }) => {
  const res = []
  selectedInstance.forEach(instance => {
    selectedKpi.forEach(kpi => {
      res.push({
        kpi_code: kpi,
        ci_id: instance
      })
    })
  })
  return res
}

/**
 * 获取视图组件的指标
 * @param {*} option
 * @return {Promise<any}
 */
const getViewComponentKpiValueList = (option) => {
  const queryMeta = compose(option)
  const query = generateDynamicQueryWithKpiCi(queryMeta)
  return apollo.clients.cache.query({ query: parse(`{ ${query} }`) })
    .then(r => r.data)
    .then(r => Object.values(r))
    .then(list => {
      return list.map((item, index) => {
        // 当记录不存在时值为空，要为其设置默认值0，并绑定mapping关系（可以从请求参数中获取）
        // eslint-disable-next-line
        const { kpi_code, ci_id, value = 0 } = item[0] || queryMeta [index]
        return { kpi_code, ci_id, value }
      })
    })
}

/**
 * 获取视图组件的实时数据
 * @param {*} data 视图组件配置
 * @return {Promise<any>}
 */
export const getComponentValues = async (data) => {
  try {
    // 1. 获取指标对应的label信息
    // 2. 获取指标的值
    const [{ kpiList, instanceList }, valueList] = await Promise.all([
      getKpiAndInstanceList(data.selectedInstance),
      getViewComponentKpiValueList(data)
    ])
    // 组合指标label与value
    const kpiMap = {}
    /* eslint-disable */
    kpiList.forEach(({ kpicode_s, label_s }) => {
      kpiMap[kpicode_s] = label_s
    })
    const instanceMap = {}
    instanceList.forEach(({ label_s, _id_s }) => {
      instanceMap[_id_s] = label_s
    })
    return valueList.map(value => ({
      ...value,
      kpiLabel: kpiMap[value.kpi_code],
      instanceLabel: instanceMap[value.ci_id]
    }))
  } catch (e) {
    throw e
  }
}
