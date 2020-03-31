import apollo from '@/utils/apollo'
import moment from 'moment'
import store from '@/store'
import Timeout from 'await-timeout'
import {
  mutationInsertViews,
  mutationUpdateView,
  queryViewList
} from '../graphql/View'

// TODO: default value
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
 * @return {*}
 */
export const addView = function (object = {}) {
  const objects = [
    {
      ...object,
      // FIXME: 此处默认一致？
      'view_name': object.view_name || object.view_title,
      // TODO: default type
      'view_type': 'h5',
      // TODO: default level
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
 * @return {*}
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
 *
 * @param {*} viewId
 */
export const getViewDesign = async function (viewId) {
  const MOCK = JSON.stringify(
    { 'id': 'view-f388d95b-3b13-47b6-ad7d-e18536afe475', 'name': '', 'config': { 'type': 'View', 'commonConfig': { 'width': 1920, 'height': 1080, 'top': 0, 'left': 0, 'zIndex': 0, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'mode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'backgroundImage': '', 'backgroundRepeat': 'no-repeat', 'backgroundSize': '', 'scaleMode': 'auto' }, 'dataConfig': { 'sourceType': 'null', 'staticData': null } }, 'views': [], 'widgets': [{ 'widgetId': 'widget-2747520a-0cc1-42a9-bb90-5d18b7945dde', 'config': { 'category': 'CHART', 'type': 'gauge', 'commonConfig': { 'width': 400, 'height': 400, 'top': 61.7145, 'left': 334.945, 'zIndex': 0, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'series': { 'name': '速度', 'type': 'gauge', 'min': 0, 'max': 220, 'splitNumber': 11, 'radius': '80%', 'axisLine': { 'lineStyle': { 'color': [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']], 'width': 3, 'shadowColor': '#fff', 'shadowBlur': 10 } }, 'axisLabel': { 'fontWeight': 'bolder', 'color': '#fff', 'shadowColor': '#fff', 'shadowBlur': 10 }, 'axisTick': { 'length': 15, 'lineStyle': { 'color': 'auto', 'shadowColor': '#fff', 'shadowBlur': 10 } }, 'splitLine': { 'length': 25, 'lineStyle': { 'width': 3, 'color': '#fff', 'shadowColor': '#fff', 'shadowBlur': 10 } }, 'pointer': { 'shadowColor': '#fff', 'shadowBlur': 5 }, 'title': { 'textStyle': { 'fontWeight': 'bolder', 'fontSize': 20, 'fontStyle': 'italic', 'color': '#fff', 'shadowColor': '#fff', 'shadowBlur': 10, 'text': 'text' } }, 'detail': { 'backgroundColor': 'rgba(30,144,255,0.8)', 'borderWidth': 1, 'borderColor': '#fff', 'shadowColor': '#fff', 'shadowBlur': 5, 'offsetCenter': [0, '50%'], 'textStyle': { 'fontWeight': 'bolder', 'color': '#fff' } }, 'data': [{ 'value': 0, 'name': 'km/h' }] }, 'backgroundColor': '#1b1b1b' }, 'dataConfig': { 'sourceType': 'null', 'staticData': null, 'dbDataConfig': { 'model': 'Linux', 'selectedInstance': ['557768655516084'], 'selectedKpi': ['2008'] } } } }, { 'widgetId': 'widget-1547d1ce-7472-42c5-8026-73c71283dd01', 'config': { 'category': 'CHART', 'type': 'Texts', 'commonConfig': { 'width': 200, 'height': 100, 'top': 161.93406995836196, 'left': 858.4615384615385, 'zIndex': 1, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'title': { 'text': '文本', 'link': '', 'target': 'blank', 'textStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 24, 'fontWeight': 'normal' }, 'position': { 'mode': 'center', 'editablePosition': [], 'top': 'center', 'bottom': 'auto', 'left': 'center', 'right': 'auto' } }, 'xAxis': { 'show': false }, 'yAxis': { 'show': false } }, 'dataConfig': { 'sourceType': 'null', 'staticData': null } } }] }
  )
  await Timeout.set(300)
  return !viewId ? null : MOCK
}
/**
 * 设计视图
 */
export const updateViewDesign = function () {}
