import apollo from '@/utils/apollo'
import moment from 'moment'
import store from '@/store'
import Timeout from 'await-timeout'
import { parse } from 'graphql'
import {
  mutationInsertViews,
  mutationUpdateView,
  queryViewList,
  generateDynamicQueryWithKpiCi,
  queryKpiAndInstanceInfo
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
  const MOCK = JSON.stringify(
    { 'id': 'view-cba048a5-b5aa-46be-982c-063d7d54869f', 'name': '', 'config': { 'type': 'View', 'commonConfig': { 'width': 1920, 'height': 1080, 'top': 0, 'left': 0, 'zIndex': 0, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'mode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'backgroundImage': '', 'backgroundRepeat': 'no-repeat', 'backgroundSize': '', 'scaleMode': 'auto' }, 'dataConfig': { 'sourceType': 'null', 'staticData': null } }, 'views': [], 'widgets': [{ 'widgetId': 'widget-dba005a7-57ec-4b12-846e-ee8e298be0d4', 'config': { 'category': 'CHART', 'type': 'Bar', 'commonConfig': { 'width': 522.825, 'height': 522.825, 'top': 107.868, 'left': 336.266, 'zIndex': 2, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'barType': 'multiple', 'legend': { 'show': false, 'orient': 'horizontal', 'top': 'auto', 'right': 'auto', 'bottom': 'auto', 'left': 'auto', 'icon': 'circle', 'textStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' } }, 'barItemStyle': { 'type': 'single', 'colorType': 'default', 'colorScheme': 'default', 'color': 'rgba(7,171,253,1)', 'barBorderRadius': [0, 0, 0, 0] }, 'barWidthType': 'auto', 'barWidth': 'auto', 'xAxis': { 'show': true, 'type': 'category', 'boundaryGap': true, 'showName': false, 'name': '', 'nameLocation': 'end', 'nameTextStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' }, 'nameGap': 15, 'gridIndex': 1, 'axisLine': { 'show': true, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisTick': { 'show': true, 'length': 5, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisLabel': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal', 'show': true, 'rotate': 0, 'margin': 8 }, 'splitLine': { 'show': false, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'aixsName': 'x', 'position': 'bottom' }, 'yAxis': { 'show': true, 'type': 'category', 'boundaryGap': true, 'showName': false, 'name': '', 'nameLocation': 'end', 'nameTextStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' }, 'nameGap': 15, 'gridIndex': 1, 'axisLine': { 'show': true, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisTick': { 'show': true, 'length': 5, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisLabel': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal', 'show': true, 'rotate': 0, 'margin': 8 }, 'splitLine': { 'show': false, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'aixsName': 'y', 'position': 'left' } }, 'dataConfig': { 'sourceType': 'real', 'staticData': { 'legend': {}, 'xAxis': { 'type': 'category', 'data': ['Forest', 'Steppe', 'Desert', 'Wetland'] }, 'yAxis': { 'type': 'value' }, 'singleSeries': [{ 'name': 'Forest', 'type': 'bar', 'stack': 'stack', 'data': [320, 0, 0, 0] }, { 'name': 'Steppe', 'type': 'bar', 'stack': 'stack', 'data': [0, 182, 0, 0] }, { 'name': 'Desert', 'type': 'bar', 'stack': 'stack', 'data': [0, 0, 201, 0] }, { 'name': 'Wetland', 'type': 'bar', 'stack': 'stack', 'data': [0, 0, 0, 400] }], 'multipleSeries': [{ 'name': 'Forest', 'type': 'bar', 'stack': null, 'data': [320, 332, 301, 334, 390] }, { 'name': 'Steppe', 'type': 'bar', 'stack': null, 'data': [220, 182, 191, 234, 290] }, { 'name': 'Desert', 'type': 'bar', 'stack': null, 'data': [150, 232, 201, 154, 190] }, { 'name': 'Wetland', 'type': 'bar', 'stack': null, 'data': [98, 77, 101, 99, 40] }] }, 'dbDataConfig': { 'model': 'Linux', 'selectedInstance': ['557768655516558', '351162445667438'], 'selectedKpi': ['2008', '1101020511'] } } } }, { 'widgetId': 'widget-2c344761-e0c0-46a5-99c0-c95a5601acdc', 'config': { 'category': 'CHART', 'type': 'gauge', 'commonConfig': { 'width': 400, 'height': 400, 'top': 172.484, 'left': 937.587, 'zIndex': 3, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'series': { 'name': '速度', 'type': 'gauge', 'min': 0, 'max': 220, 'splitNumber': 11, 'radius': '80%', 'axisLine': { 'lineStyle': { 'color': [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']], 'width': 3, 'shadowColor': '#fff', 'shadowBlur': 10 } }, 'axisLabel': { 'fontWeight': 'bolder', 'color': '#fff', 'shadowColor': '#fff', 'shadowBlur': 10 }, 'axisTick': { 'length': 15, 'lineStyle': { 'color': 'auto', 'shadowColor': '#fff', 'shadowBlur': 10 } }, 'splitLine': { 'length': 25, 'lineStyle': { 'width': 3, 'color': '#fff', 'shadowColor': '#fff', 'shadowBlur': 10 } }, 'pointer': { 'shadowColor': '#fff', 'shadowBlur': 5 }, 'title': { 'textStyle': { 'fontWeight': 'bolder', 'fontSize': 20, 'fontStyle': 'italic', 'color': '#fff', 'shadowColor': '#fff', 'shadowBlur': 10, 'text': 'text' } }, 'detail': { 'backgroundColor': 'rgba(30,144,255,0.8)', 'borderWidth': 1, 'borderColor': '#fff', 'shadowColor': '#fff', 'shadowBlur': 5, 'offsetCenter': [0, '50%'], 'textStyle': { 'fontWeight': 'bolder', 'color': '#fff' } }, 'data': [{ 'value': 100, 'name': 'km/h' }] }, 'backgroundColor': '#1b1b1b' }, 'dataConfig': { 'sourceType': 'real', 'staticData': null, 'dbDataConfig': { 'model': 'Linux', 'selectedInstance': ['557768655516084'], 'selectedKpi': ['2008'] } } } }] }
  )
  await Timeout.set(300)
  return !viewId ? null : MOCK
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
