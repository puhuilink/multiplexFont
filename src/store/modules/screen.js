import Vue from 'vue'
import Vuex from 'vuex'
import anime from 'animejs'
import _ from 'lodash'
import Edge from '@/model/edges'

Vue.use(Vuex)

export const ScreenMutations = {
  SET_VIEW: 'SET_VIEW[设置视图对象]',
  ADD_WIDGET: 'ADD_WIDGET[添加部件]',
  REMOVE_WIDGET: 'REMOVE_WIDGET[移除部件]',
  ACTIVATE_WIDGET: 'ACTIVATE_WIDGET[设置激活的部件]',
  MODIFY_TOPOLOGY_EDITABLE_STATUS: 'MODIFY_TOPOLOGY_EDITABLE_STATUS[修改拓扑图可编辑状态]',
  ACTIVATE_NODE: 'ACTIVATE_NODE[设置激活的节点]',
  ACTIVATE_EDGE: 'ACTIVATE_EDGE[设置激活的边]',
  RESET_TOPOLOGY_STATE: 'RESET_TOPOLOGY_STATE[重置拓扑状态]',
  SET_EDGE_CONFIG: 'SET_EDGE_CONFIG[设置边配置]',
  UPDATE_TOPOLOGY_CONFIG: 'UPDATE_TOPOLOGY_CONFIG[更新拓扑节点配置]'
}

export default {
  namespaced: true,
  state: {
    // 视图对象
    view: {
      widgets: []
    },
    // 激活的部件对象，作为可读属性使用，不可通过非mutation方式进行修改
    activeWidget: null,
    // 拓扑图是否可编辑
    topologyEditable: false,
    // 拓扑图是否可更改尺寸
    topologyResizable: true,
    // 激活的拓扑节点
    activeNode: null,
    // 激活的拓扑边
    activeEdge: null,
    // 边配置
    edgeConfig: new Edge({})
  },
  getters: {
    // 视图中所有部件对象
    widgets (state) {
      return state.view.widgets
    },
    // 视图中所有拓扑图节点
    topologyWidgets (state, getters) {
      return getters.widgets.filter(({ config }) => config.type === 'Topology')
    },
    // 视图中所有拓扑图内的节点
    nodes (state, getters) {
      return getters.topologyWidgets.map(({ config }) => config.proprietaryConfig.nodes).flat()
    },
    // 画板缩放比例
    scale (state) {
      return state.view.scale || 1
    },
    // 所有部件对象的位置，用于对齐吸附计算
    positions (state, getters) {
      return getters.widgets
        .filter(({ widgetId }) => widgetId !== _.get(state, ['activeWidget', 'widgetId'], widgetId))
        .map(({ config: { commonConfig } }) => _.pick(commonConfig, ['top', 'left', 'width', 'height']))
    },
    positionYs (state, getters) {
      return _.uniq(getters.positions.map(({ top, height }) => [top, top + height]).flat())
    },
    positionXs (state, getters) {
      return _.uniq(getters.positions.map(({ left, width }) => [left, left + width]).flat())
    }
  },
  mutations: {
    // 设置视图对象
    [ScreenMutations.SET_VIEW] (state, payload) {
      state.view = payload.view
    },
    // 向视图部件库中添加部件
    [ScreenMutations.ADD_WIDGET] (state, payload) {
      state.view.widgets.push(payload.widget)
    },
    // 从视图部件库中移除该部件
    [ScreenMutations.REMOVE_WIDGET] (state, payload) {
      // FIXME: 当画布上有多个组件时，使用 splice 会导致删除的不是当前选中的组件
      // const index = state.view.widgets.findIndex(widget => widget.widgetId !== payload.widgetId)
      // state.view.widgets.splice(index, 1)
      state.view.widgets = state.view.widgets.filter(widget => widget.widgetId !== payload.widgetId)
      // 置空激活部件
      state.activeWidget = null
      // 隐藏选择器
      anime.set(document.getElementById('wrapper'), {
        display: 'none'
      })
    },
    // 设置激活的部件，并修改widgets中的部件
    [ScreenMutations.ACTIVATE_WIDGET] (state, payload) {
      // 如果选择的是部件，深度复制激活部件，保留render对象，则更新部件的配置
      if (payload.widget && payload.widget.widgetId) {
        const activeWidget = state.view.widgets.find(
          widget => widget.widgetId === payload.widget.widgetId
        )
        Object.assign(activeWidget, _.omit(payload.widget, ['render']))
        state.activeWidget = activeWidget
      } else {
        state.activeWidget = payload.widget
      }
    },
    // 修改拓扑图可编辑状态
    [ScreenMutations.MODIFY_TOPOLOGY_EDITABLE_STATUS] (state, payload) {
      state.topologyEditable = payload.editable
    },
    // 设置激活的拓扑节点
    [ScreenMutations.ACTIVATE_NODE] (state, payload) {
      state.activeNode = payload.activeNode
    },
    // 更新拓扑节点配置
    [ScreenMutations.UPDATE_TOPOLOGY_CONFIG] (state) {
      const { render } = state.activeWidget || { render: null }
      // 如果是拓扑图的实例对象
      if (render && render.chart && Object.getPrototypeOf(render.chart).constructor.name === 'e') {
        const options = _.cloneDeep(render.chart.save())
        options.edges = options.edges.map(edge => _.omit(edge, ['sourceNode', 'targetNode']))
        Object.assign(state.activeWidget.config.proprietaryConfig, options)
      }
    },
    // 设置激活的拓扑边
    [ScreenMutations.ACTIVATE_EDGE] (state, payload) {
      state.activeEdge = payload.activeEdge
    },
    // 重置拓扑状态
    [ScreenMutations.RESET_TOPOLOGY_STATE] (state) {
      Object.assign(state, {
        topologyEditable: false,
        activeNode: null,
        activeEdge: null,
        edgeConfig: new Edge({})
      })
    },
    // 设置边配置
    [ScreenMutations.SET_EDGE_CONFIG] (state, payload) {
      state.edgeConfig = payload.edgeConfig
    }
  },
  actions: {
  },
  modules: {
  }
}
