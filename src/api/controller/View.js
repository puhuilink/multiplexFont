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
  queryViewContent,
  mutationDeletViews
} from '../graphql/View'
import { axios } from '@/utils/request'

export const getViewList = function (variables = {}) {
  const where = variables.where || {}
  return apollo.clients.alert.query({
    query: queryViewList,
    variables: {
      ...variables,
      where: {
        ...where,
        'view_type': {
          _eq: 'h5'
        }
      }
    }
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
      set: {
        ...set,
        updator: store.state.user.info.userId,
        updatedate: moment().format('YYYY-MM-DDTHH:mm:ss')
      }
    }
  }).then(r => r.data.update_t_view.affected_rows)
    .then(row => {
      if (row === 1) {
        return true
      } else {
        throw new Error('更新视图配置失败')
      }
    })
}

export const deleteViews = function (viewIdList = []) {
  return apollo.clients.alert.mutate({
    mutation: mutationDeletViews,
    variables: {
      viewIdList
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
      creator: store.state.user.info.userId,
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
  // const option = `{"id":"view-6b5d78bd-6d88-48ee-a73e-01c2119a6b9b","name":"","config":{"type":"View","commonConfig":{"width":1920,"height":1080,"top":0,"left":0,"zIndex":0,"colorMode":"single","backgroundColor":"rgba(255,255,255,1)","border":{"borderStyle":"solid","borderColor":"#333","borderWidth":0,"borderRadius":{"borderTopLeftRadius":0,"borderTopRightRadius":0,"borderBottomRightRadius":0,"borderBottomLeftRadius":0}},"padding":[0,0,0,0]},"proprietaryConfig":{"mode":"single","backgroundColor":"rgba(255,255,255,1)","backgroundImage":"","backgroundRepeat":"no-repeat","backgroundSize":"","scaleMode":"auto"},"dataConfig":{"sourceType":"null","staticData":null}},"views":[],"widgets":[{"widgetId":"widget-d1549018-1654-4d7d-acb3-6753be01a49c","config":{"category":"CHART","type":"Circle","commonConfig":{"width":300,"height":300,"top":101.264,"left":188.347,"zIndex":0,"colorMode":"single","backgroundColor":"rgba(255,255,255,1)","border":{"borderStyle":"solid","borderColor":"#333","borderWidth":0,"borderRadius":{"borderTopLeftRadius":0,"borderTopRightRadius":0,"borderBottomRightRadius":0,"borderBottomLeftRadius":0}},"padding":[0,0,0,0]},"proprietaryConfig":{"graphic":{"top":0,"left":0,"right":0,"bottom":0,"style":{"colorMode":"single","fill":"rgba(64,169,255, 1)","stroke":"rgba(12,142,255, 1)","lineWidth":0},"type":"circle","shape":{"cx":0,"cy":0,"r":150}}},"dataConfig":{"sourceType":"null","staticData":null}}},{"widgetId":"widget-ace9a1d0-5848-4091-a26d-16e3956f867d","config":{"category":"CHART","type":"Clock","commonConfig":{"width":300,"height":100,"top":166.92,"left":578.559,"zIndex":1,"colorMode":"single","backgroundColor":"rgba(255,255,255,1)","border":{"borderStyle":"solid","borderColor":"#333","borderWidth":0,"borderRadius":{"borderTopLeftRadius":0,"borderTopRightRadius":0,"borderBottomRightRadius":0,"borderBottomLeftRadius":0}},"padding":[0,0,0,0]},"proprietaryConfig":{"title":{"text":"2020-04-05 16:19:39","link":"","target":"blank","textStyle":{"color":"rgba(0, 0, 0, 1)","fontStyle":"normal","fontSize":24,"fontWeight":"normal"},"position":{"mode":"center","editablePosition":[],"top":"center","bottom":"auto","left":"center","right":"auto"}},"xAxis":{"show":false},"yAxis":{"show":false},"format":"YYYY-MM-DD HH:mm:ss"},"dataConfig":{"sourceType":"null","staticData":null}}}]}`
  // return JSON.parse(option)
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
export const updateViewDesign = async function (viewId, content) {
  return apollo.clients.alert.mutate({
    mutation: mutationUpdateView,
    variables: {
      viewId: Number(viewId),
      set: {
        content: content ? JSON.stringify(content) : '',
        updator: store.state.user.info.userId,
        updatedate: moment().format('YYYY-MM-DDTHH:mm:ss')
      }
    }
  }).then(r => r.data.update_t_view.affected_rows)
    .then(row => {
      if (row === 1) {
        return true
      } else {
        throw new Error('更新视图配置失败')
      }
    })
}

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
 * @param {Object | Null} timeRange 要查询的时间段：为 falsy 时直接查询最新数据
 * @return {Promise<any}
 */
const getViewComponentKpiValueList = (option, timeRange) => {
  const queryMeta = compose(option)
  const query = generateDynamicQueryWithKpiCi(queryMeta, timeRange)

  const server = (timeRange && timeRange.timeRangeStart !== timeRange.timeRangeEnd) ? apollo.clients.alert : apollo.clients.cache

  return server.query({ query: parse(`{ ${query} }`) })
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
 * @param {Object | Null} timeRange 要查询的时间段：不传之或值为 falsy 时直接查询最新数据
 * @param {Number} limit 要查询的条数：不传值或值为 falsy 时查询所有条目
 * @return {Promise<any>}
 */
export const getComponentValues = async (data, timeRange, limit) => {
  // TODO: limit 动态判断？
  try {
    // 1. 获取指标对应的label信息
    // 2. 获取指标的值
    const [{ kpiList, instanceList }, valueList] = await Promise.all([
      getKpiAndInstanceList(data.selectedInstance),
      getViewComponentKpiValueList(data, timeRange)
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

export const copyView = async (viewId) => {
  return axios.get(`/view/copy?viewId=${viewId}`)
}