import apollo from '@/utils/apollo'
import moment from 'moment'
import store from '@/store'
import Timeout from 'await-timeout'
import gql from 'graphql-tag'
import { parse } from 'graphql'
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
 * 视图配置详情
 * @param {*} viewId
 * @return {Promise<String>}
 */
export const getViewDesign = async function (viewId) {
  const MOCK = JSON.stringify(
    // { 'id': 'view-f388d95b-3b13-47b6-ad7d-e18536afe475', 'name': '', 'config': { 'type': 'View', 'commonConfig': { 'width': 1920, 'height': 1080, 'top': 0, 'left': 0, 'zIndex': 0, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'mode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'backgroundImage': '', 'backgroundRepeat': 'no-repeat', 'backgroundSize': '', 'scaleMode': 'auto' }, 'dataConfig': { 'sourceType': 'null', 'staticData': null } }, 'views': [], 'widgets': [{ 'widgetId': 'widget-2747520a-0cc1-42a9-bb90-5d18b7945dde', 'config': { 'category': 'CHART', 'type': 'gauge', 'commonConfig': { 'width': 400, 'height': 400, 'top': 61.7145, 'left': 334.945, 'zIndex': 0, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'series': { 'name': '速度', 'type': 'gauge', 'min': 0, 'max': 220, 'splitNumber': 11, 'radius': '80%', 'axisLine': { 'lineStyle': { 'color': [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']], 'width': 3, 'shadowColor': '#fff', 'shadowBlur': 10 } }, 'axisLabel': { 'fontWeight': 'bolder', 'color': '#fff', 'shadowColor': '#fff', 'shadowBlur': 10 }, 'axisTick': { 'length': 15, 'lineStyle': { 'color': 'auto', 'shadowColor': '#fff', 'shadowBlur': 10 } }, 'splitLine': { 'length': 25, 'lineStyle': { 'width': 3, 'color': '#fff', 'shadowColor': '#fff', 'shadowBlur': 10 } }, 'pointer': { 'shadowColor': '#fff', 'shadowBlur': 5 }, 'title': { 'textStyle': { 'fontWeight': 'bolder', 'fontSize': 20, 'fontStyle': 'italic', 'color': '#fff', 'shadowColor': '#fff', 'shadowBlur': 10, 'text': 'text' } }, 'detail': { 'backgroundColor': 'rgba(30,144,255,0.8)', 'borderWidth': 1, 'borderColor': '#fff', 'shadowColor': '#fff', 'shadowBlur': 5, 'offsetCenter': [0, '50%'], 'textStyle': { 'fontWeight': 'bolder', 'color': '#fff' } }, 'data': [{ 'value': 0, 'name': 'km/h' }] }, 'backgroundColor': '#1b1b1b' }, 'dataConfig': { 'sourceType': 'null', 'staticData': null, 'dbDataConfig': { 'model': 'Linux', 'selectedInstance': ['557768655516084'], 'selectedKpi': ['2008'] } } } }, { 'widgetId': 'widget-1547d1ce-7472-42c5-8026-73c71283dd01', 'config': { 'category': 'CHART', 'type': 'Texts', 'commonConfig': { 'width': 200, 'height': 100, 'top': 161.93406995836196, 'left': 858.4615384615385, 'zIndex': 1, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'title': { 'text': '文本', 'link': '', 'target': 'blank', 'textStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 24, 'fontWeight': 'normal' }, 'position': { 'mode': 'center', 'editablePosition': [], 'top': 'center', 'bottom': 'auto', 'left': 'center', 'right': 'auto' } }, 'xAxis': { 'show': false }, 'yAxis': { 'show': false } }, 'dataConfig': { 'sourceType': 'null', 'staticData': null } } }] }
    // { 'id': 'view-95da3be1-bd0e-44a2-bcf5-4c1f57eed465', 'name': '', 'config': { 'type': 'View', 'commonConfig': { 'width': 1920, 'height': 1080, 'top': 0, 'left': 0, 'zIndex': 0, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'mode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'backgroundImage': '', 'backgroundRepeat': 'no-repeat', 'backgroundSize': '', 'scaleMode': 'auto' }, 'dataConfig': { 'sourceType': 'null', 'staticData': null } }, 'views': [], 'widgets': [{ 'widgetId': 'widget-dba005a7-57ec-4b12-846e-ee8e298be0d4', 'config': { 'category': 'CHART', 'type': 'Bar', 'commonConfig': { 'width': 300, 'height': 300, 'top': 107.868, 'left': 336.266, 'zIndex': 2, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'barType': 'single', 'legend': { 'show': false, 'orient': 'horizontal', 'top': 'auto', 'right': 'auto', 'bottom': 'auto', 'left': 'auto', 'icon': 'circle', 'textStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' } }, 'barItemStyle': { 'type': 'single', 'colorType': 'default', 'colorScheme': 'default', 'color': 'rgba(7,171,253,1)', 'barBorderRadius': [0, 0, 0, 0] }, 'barWidthType': 'auto', 'barWidth': 'auto', 'xAxis': { 'show': true, 'type': 'category', 'boundaryGap': true, 'showName': false, 'name': '', 'nameLocation': 'end', 'nameTextStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' }, 'nameGap': 15, 'gridIndex': 1, 'axisLine': { 'show': true, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisTick': { 'show': true, 'length': 5, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisLabel': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal', 'show': true, 'rotate': 0, 'margin': 8 }, 'splitLine': { 'show': false, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'aixsName': 'x', 'position': 'bottom' }, 'yAxis': { 'show': true, 'type': 'category', 'boundaryGap': true, 'showName': false, 'name': '', 'nameLocation': 'end', 'nameTextStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' }, 'nameGap': 15, 'gridIndex': 1, 'axisLine': { 'show': true, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisTick': { 'show': true, 'length': 5, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisLabel': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal', 'show': true, 'rotate': 0, 'margin': 8 }, 'splitLine': { 'show': false, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'aixsName': 'y', 'position': 'left' } }, 'dataConfig': { 'sourceType': 'real', 'staticData': { 'legend': {}, 'xAxis': { 'type': 'category', 'data': ['Forest', 'Steppe', 'Desert', 'Wetland'] }, 'yAxis': { 'type': 'value' }, 'singleSeries': [{ 'name': 'Forest', 'type': 'bar', 'stack': 'stack', 'data': [320, 0, 0, 0] }, { 'name': 'Steppe', 'type': 'bar', 'stack': 'stack', 'data': [0, 182, 0, 0] }, { 'name': 'Desert', 'type': 'bar', 'stack': 'stack', 'data': [0, 0, 201, 0] }, { 'name': 'Wetland', 'type': 'bar', 'stack': 'stack', 'data': [0, 0, 0, 400] }], 'multipleSeries': [{ 'name': 'Forest', 'type': 'bar', 'stack': null, 'data': [320, 332, 301, 334, 390] }, { 'name': 'Steppe', 'type': 'bar', 'stack': null, 'data': [220, 182, 191, 234, 290] }, { 'name': 'Desert', 'type': 'bar', 'stack': null, 'data': [150, 232, 201, 154, 190] }, { 'name': 'Wetland', 'type': 'bar', 'stack': null, 'data': [98, 77, 101, 99, 40] }] }, 'dbDataConfig': { 'model': '', 'selectedInstance': [], 'selectedKpi': [] } } } }] }
    // { 'id': 'view-0f82b6aa-9c53-4701-97a2-7b9627476740', 'name': '', 'config': { 'type': 'View', 'commonConfig': { 'width': 1920, 'height': 1080, 'top': 0, 'left': 0, 'zIndex': 0, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'mode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'backgroundImage': '', 'backgroundRepeat': 'no-repeat', 'backgroundSize': '', 'scaleMode': 'auto' }, 'dataConfig': { 'sourceType': 'null', 'staticData': null } }, 'views': [], 'widgets': [{ 'widgetId': 'widget-dba005a7-57ec-4b12-846e-ee8e298be0d4', 'config': { 'category': 'CHART', 'type': 'Bar', 'commonConfig': { 'width': 300, 'height': 300, 'top': 107.868, 'left': 336.266, 'zIndex': 2, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'barType': 'single', 'legend': { 'show': false, 'orient': 'horizontal', 'top': 'auto', 'right': 'auto', 'bottom': 'auto', 'left': 'auto', 'icon': 'circle', 'textStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' } }, 'barItemStyle': { 'type': 'single', 'colorType': 'default', 'colorScheme': 'default', 'color': 'rgba(7,171,253,1)', 'barBorderRadius': [0, 0, 0, 0] }, 'barWidthType': 'auto', 'barWidth': 'auto', 'xAxis': { 'show': true, 'type': 'category', 'boundaryGap': true, 'showName': false, 'name': '', 'nameLocation': 'end', 'nameTextStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' }, 'nameGap': 15, 'gridIndex': 1, 'axisLine': { 'show': true, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisTick': { 'show': true, 'length': 5, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisLabel': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal', 'show': true, 'rotate': 0, 'margin': 8 }, 'splitLine': { 'show': false, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'aixsName': 'x', 'position': 'bottom' }, 'yAxis': { 'show': true, 'type': 'category', 'boundaryGap': true, 'showName': false, 'name': '', 'nameLocation': 'end', 'nameTextStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' }, 'nameGap': 15, 'gridIndex': 1, 'axisLine': { 'show': true, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisTick': { 'show': true, 'length': 5, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisLabel': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal', 'show': true, 'rotate': 0, 'margin': 8 }, 'splitLine': { 'show': false, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'aixsName': 'y', 'position': 'left' } }, 'dataConfig': { 'sourceType': 'real', 'staticData': { 'legend': {}, 'xAxis': { 'type': 'category', 'data': ['Forest', 'Steppe', 'Desert', 'Wetland'] }, 'yAxis': { 'type': 'value' }, 'singleSeries': [{ 'name': 'Forest', 'type': 'bar', 'stack': 'stack', 'data': [320, 0, 0, 0] }, { 'name': 'Steppe', 'type': 'bar', 'stack': 'stack', 'data': [0, 182, 0, 0] }, { 'name': 'Desert', 'type': 'bar', 'stack': 'stack', 'data': [0, 0, 201, 0] }, { 'name': 'Wetland', 'type': 'bar', 'stack': 'stack', 'data': [0, 0, 0, 400] }], 'multipleSeries': [{ 'name': 'Forest', 'type': 'bar', 'stack': null, 'data': [320, 332, 301, 334, 390] }, { 'name': 'Steppe', 'type': 'bar', 'stack': null, 'data': [220, 182, 191, 234, 290] }, { 'name': 'Desert', 'type': 'bar', 'stack': null, 'data': [150, 232, 201, 154, 190] }, { 'name': 'Wetland', 'type': 'bar', 'stack': null, 'data': [98, 77, 101, 99, 40] }] }, 'dbDataConfig': { 'model': 'XM-Linux', 'selectedInstance': ['123069817938696', '123069817938766', '123069817938738', '242385715310056'], 'selectedKpi': ['21101021414', '21101020322', '21101020814'] } } } }] }
    { 'id': 'view-d866463e-797d-40f3-a219-a4281fd5feec', 'name': '', 'config': { 'type': 'View', 'commonConfig': { 'width': 1920, 'height': 1080, 'top': 0, 'left': 0, 'zIndex': 0, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'mode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'backgroundImage': '', 'backgroundRepeat': 'no-repeat', 'backgroundSize': '', 'scaleMode': 'auto' }, 'dataConfig': { 'sourceType': 'null', 'staticData': null } }, 'views': [], 'widgets': [{ 'widgetId': 'widget-dba005a7-57ec-4b12-846e-ee8e298be0d4', 'config': { 'category': 'CHART', 'type': 'Bar', 'commonConfig': { 'width': 300, 'height': 300, 'top': 107.868, 'left': 336.266, 'zIndex': 2, 'colorMode': 'single', 'backgroundColor': 'rgba(255,255,255,1)', 'border': { 'borderStyle': 'solid', 'borderColor': '#333', 'borderWidth': 0, 'borderRadius': { 'borderTopLeftRadius': 0, 'borderTopRightRadius': 0, 'borderBottomRightRadius': 0, 'borderBottomLeftRadius': 0 } }, 'padding': [0, 0, 0, 0] }, 'proprietaryConfig': { 'barType': 'single', 'legend': { 'show': false, 'orient': 'horizontal', 'top': 'auto', 'right': 'auto', 'bottom': 'auto', 'left': 'auto', 'icon': 'circle', 'textStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' } }, 'barItemStyle': { 'type': 'single', 'colorType': 'default', 'colorScheme': 'default', 'color': 'rgba(7,171,253,1)', 'barBorderRadius': [0, 0, 0, 0] }, 'barWidthType': 'auto', 'barWidth': 'auto', 'xAxis': { 'show': true, 'type': 'category', 'boundaryGap': true, 'showName': false, 'name': '', 'nameLocation': 'end', 'nameTextStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' }, 'nameGap': 15, 'gridIndex': 1, 'axisLine': { 'show': true, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisTick': { 'show': true, 'length': 5, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisLabel': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal', 'show': true, 'rotate': 0, 'margin': 8 }, 'splitLine': { 'show': false, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'aixsName': 'x', 'position': 'bottom' }, 'yAxis': { 'show': true, 'type': 'category', 'boundaryGap': true, 'showName': false, 'name': '', 'nameLocation': 'end', 'nameTextStyle': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal' }, 'nameGap': 15, 'gridIndex': 1, 'axisLine': { 'show': true, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisTick': { 'show': true, 'length': 5, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'axisLabel': { 'color': 'rgba(0, 0, 0, 1)', 'fontStyle': 'normal', 'fontSize': 12, 'fontWeight': 'normal', 'show': true, 'rotate': 0, 'margin': 8 }, 'splitLine': { 'show': false, 'lineStyle': { 'color': 'rgba(0,0,0,1)', 'width': 2, 'type': 'solid' } }, 'aixsName': 'y', 'position': 'left' } }, 'dataConfig': { 'sourceType': 'real', 'staticData': { 'legend': {}, 'xAxis': { 'type': 'category', 'data': ['Forest', 'Steppe', 'Desert', 'Wetland'] }, 'yAxis': { 'type': 'value' }, 'singleSeries': [{ 'name': 'Forest', 'type': 'bar', 'stack': 'stack', 'data': [320, 0, 0, 0] }, { 'name': 'Steppe', 'type': 'bar', 'stack': 'stack', 'data': [0, 182, 0, 0] }, { 'name': 'Desert', 'type': 'bar', 'stack': 'stack', 'data': [0, 0, 201, 0] }, { 'name': 'Wetland', 'type': 'bar', 'stack': 'stack', 'data': [0, 0, 0, 400] }], 'multipleSeries': [{ 'name': 'Forest', 'type': 'bar', 'stack': null, 'data': [320, 332, 301, 334, 390] }, { 'name': 'Steppe', 'type': 'bar', 'stack': null, 'data': [220, 182, 191, 234, 290] }, { 'name': 'Desert', 'type': 'bar', 'stack': null, 'data': [150, 232, 201, 154, 190] }, { 'name': 'Wetland', 'type': 'bar', 'stack': null, 'data': [98, 77, 101, 99, 40] }] }, 'dbDataConfig': { 'model': 'Linux', 'selectedInstance': ['557768655516558', '351162445667438', '557768655516078'], 'selectedKpi': ['2008'] } } } }] }
  )
  await Timeout.set(300)
  return !viewId ? null : MOCK
}
/**
 * 更新视图配置
 * @return {Promise<any>}
 */
export const updateViewDesign = async function () { }

/**
 * 根据传入的 [Kpi_code_s] 批量获取其基础信息
 * @param {*} kpiCodeList
 * @return {Promise<any>}
 */
const getKpiList = (kpiCodeList) => {
  return apollo.clients.resource.query({
    query: gql`query ($kpiCodeList: [String!]) {
      data: ngecc_instance_values(where: {kpicode_s: {
        _in: $kpiCodeList
      }}) {
        label_s
        kpicode_s
      }
    }
    `,
    variables: {
      kpiCodeList
    }
  }).then(r => r.data.data)
}

/**
 * 根据传入的 [instance_id_s] 批量获取其基础信息
 * @param {*} instanceIdList
 * @return {Promise<any>}
 */
const getInstanceList = (instanceIdList) => {
  return apollo.clients.resource.query({
    query: gql`query ($instanceIdList: [String!]) {
      data: ngecc_instance(where: {_id_s: {_in: $instanceIdList}}) {
        label_s
        _id_s
      }
    }
    `,
    variables: {
      instanceIdList
    }
  }).then(r => r.data.data)
}

const getValueList = (data) => {
  const query = generateQueryList(
    compose(data)
  )
  return apollo.clients.cache.query({ query: parse(`{ ${query} }`) })
    .then(r => r.data)
    .then(r => Object.values(r))
    .then(list => list.map(([item]) => item))
}

/**
 * 组合 Kpi 数组与 Ci 数组为一一匹配的一维数组
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

const generateQueryList = (options = []) => {
  /* eslint-disable */
  // hasura 每条数据的返回值键名不能重复，此处以索引做区分，后期再合并为数组
  return options.map(({ kpi_code, ci_id }, index) => (
    `data${index}: t_kpi_current(where: {
      _and: {
        kpi_code: {_eq: ${kpi_code}},
        ci_id: {_eq: "${ci_id}"}}
    }) {
      value: kpi_value_num
      kpi_code
      ci_id
    }`
  ))
}

export const getComponentValues = async (data) => {
  const [kpiList, instanceList, valueList] = await Promise.all([
    getKpiList(data.selectedKpi),
    getInstanceList(data.selectedInstance),
    getValueList(data)
  ])
  const kpiMap = {}
  kpiList.forEach(({ kpicode_s, label_s }) => {
    kpiMap[kpicode_s] = label_s
  })
  const instanceMap = {}
  instanceList.forEach(({ label_s, _id_s }) => {
    instanceMap[_id_s] = label_s
  })
  valueList.forEach(value => {
    value['kpiLabel'] = kpiMap[value.kpi_code]
    value['instanceLabel'] = instanceMap[value.ci_id]
  })
  console.log(kpiMap, instanceMap, valueList)
  return valueList
}
