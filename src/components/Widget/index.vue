/**
* 部件渲染组件
* Author: dong xing
* Date: 2019/11/13
* Time: 4:02 下午
* Email: dong.xing@outlook.com
*/
<template>
  <div
    class="widget"
    :class="{
      'widget--hover': !onlyShow,
      'widget--sub-active': !onlyShow && isSubActive
    }"
    :id="widget.widgetId"
    :data-category="widget.config.category"
    :data-type="widget.config.type"
    :ref="widget.widgetId"
    @click.stop="() => $emit('select', selectWidget)"
  >
    <!-- 视图钻取：双击跳转到新视图，跳转配置与细节待与产品沟通 -->
    <!-- @dblclick.stop="() => $emit('drill', { viewId: 8947 })" -->

    <!-- / 元素部件 -->
    <!-- 可以是vue组件，需要其持有者手动挂载到该div -->
    <!-- FIXME: 这种方式可能导致vue-devtools无法正常调试 -->
    <div ref="element" v-if="useComponent"></div>

  </div>
</template>

<script>
import _ from 'lodash'
import { mapMutations, mapState } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import Factory from '@/model/factory/factory'
import Widget from '@/model/widget'
import { TIME_RANGE_TYPE_CUSTOM } from '@/model/config/dataConfig/dynamicData/common/TimeRangeConfig'
import TopologyChart from '@/model/charts/TopologyChart'
import { NODE_CI_DRILL_TYPE_VIEW } from '@/model/nodes'
import { SOURCE_TYPE_REAL } from '@/model/config/dataConfig/dynamicData/types/sourceType'
import { NODE_TYPE_CIRCLE } from '@/plugins/g6-types'

const nodeFactory = Factory.createNodeFactory()

export default {
  name: 'Widget',
  components: {},
  props: {
    widget: {
      type: Object,
      default: () => ({})
    },
    onlyShow: {
      type: Boolean,
      default: false
    },
    // 外部 Ci
    ciId: {
      type: String,
      default: ''
    },
    timeRange: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    render: null,
    isSubscribed: true,
    isHighLightForAutoAlign: false
  }),
  computed: {
    ...mapState('screen', ['isImporting', 'activeWidget', 'subActiveWidgets']),
    // 部件是否被批量选中
    isSubActive () {
      const {
        widget: { widgetId },
        activeWidget,
        subActiveWidgets
      } = this

      return (
        activeWidget &&
        widgetId !== activeWidget.widgetId &&
        !!subActiveWidgets.find(widget => widget.widgetId === widgetId)
      )
    },
    // 选择的部件
    selectWidget () {
      return Object.assign(this.widget, { render: this.render })
    },
    // 在类型为元素时使用组件进行渲染
    useComponent () {
      return this.widget.config.category === 'ELEMENT'
    }
  },
  watch: {
    timeRange: {
      deep: true,
      immediate: true,
      async handler (timeRange) {
        if (this.onlyShow) {
          await this.$nextTick()
          const { dataConfig = {} } = this.widget.config
          const { sourceType, dbDataConfig = {} } = dataConfig
          const { timeRangeConfig = {} } = dbDataConfig
          if (sourceType === SOURCE_TYPE_REAL && timeRange[0] && timeRange[1]) {
            this.setTimeRange(timeRangeConfig, timeRange)
          } else {
            this.rollbackTimeRange(timeRangeConfig)
          }
          // 更新时间配置后刷新配置与数据
          this.render.restartIntervalRefresh && this.render.restartIntervalRefresh()
        }
      }
    }
  },
  methods: {
    ...mapMutations('screen', {
      activateWidget: ScreenMutations.ACTIVATE_WIDGET
    }),
    /**
     * 拓扑图内 Ci 节点钻取事件
     * 跳转新视图或页签
     */
    drill ({ item }) {
      // const model = item.getModel()
      // if (model.shape === NODE_TYPE_CIRCLE) {}
      // const drillConfig = _.get(model, 'nodeDynamicDataConfig.drillConfig', {})
      // mock data
      const drillConfig = { drillType: NODE_CI_DRILL_TYPE_VIEW, viewList: [9401] }
      // const { drillType = NODE_CI_DRILL_TYPE_VIEW, viewList = [] } = drillConfig
      // if (!_.isEmpty(viewList)) {}
      this.$emit('drill', _.cloneDeep(drillConfig))
    },
    setTimeRange (timeRangeConfig, timeRange) {
      const { timeRangeType, _timeRangeType, customTimeRange } = timeRangeConfig
      if (!_timeRangeType) {
        // 备份原始配置
        timeRangeConfig._timeRangeType = timeRangeType
        timeRangeConfig._customTimeRange = customTimeRange
        // 覆写新配置
        timeRangeConfig.timeRangeType = TIME_RANGE_TYPE_CUSTOM
        timeRangeConfig.customTimeRange = timeRange
      }
    },
    rollbackTimeRange (timeRangeConfig) {
      const { _timeRangeType, _customTimeRange } = timeRangeConfig
      // 还原备份配置
      if (_timeRangeType) {
        timeRangeConfig.timeRangeType = _timeRangeType
        timeRangeConfig.customTimeRange = _customTimeRange
      }
      // 删除备份配置
      Reflect.deleteProperty(timeRangeConfig, '_timeRangeType')
      Reflect.deleteProperty(timeRangeConfig, '_customTimeRange')
    },
    initTopologyChart () {
      const { render } = this
      const {
        config: { proprietaryConfig }
      } = render
      // chart.on('node:click', this.drill)
      proprietaryConfig.nodes = proprietaryConfig.nodes.map(node => {
        // 筛选出需要定时刷新的节点，因为节点只存储了配置，展示时需要将其实例化
        if (node.shape === NODE_TYPE_CIRCLE) {
          return nodeFactory.create(node)
        }
        return node
      })
      const circleNodeList = proprietaryConfig.nodes
      render.enablePreviewMode()
      // 开启轮询
      circleNodeList.forEach(node => {
        node.intervalRefresh && node.intervalRefresh()
      })
    }
  },
  mounted () {
    const dbDataConfig = _.get(this, 'widget.config.dataConfig.dbDataConfig')
    const externalCi = _.get(dbDataConfig, 'externalCi')
    // 外部 Ci 可用时，传递进来的 Ci 将会替代此组件中选择的 Ci
    if (externalCi && this.ciId) {
      dbDataConfig.resourceConfig.selectedInstance = [ this.ciId ]
    }
    // 在直接使用配置渲染情况中，此时 widget prop 并不是 Widget 的实例，需要将其实例化
    if (!(this.widget instanceof Widget)) {
      Object.assign(this.widget, new Widget(this.widget))
    }
    const { category, type } = this.widget.config
    const widgetFactory = category === 'CHART'
      ? Factory.createChartFactory()
      : Factory.createElementFactory()
    // 根据类型创建图表
    this.render = widgetFactory.create(type, {
      widget: this.widget,
      element: this.$refs.element,
      onlyShow: this.onlyShow
    })
    if (this.onlyShow) {
      // 如果在视图展示状态下，组件（轮询）动态加载数据
      this.render.intervalRefresh && this.render.intervalRefresh()
      if (this.render instanceof TopologyChart) {
        // TODO: 待调试
        this.initTopologyChart()
      }
    } else if (!this.isImporting) {
      this.activateWidget({
        widget: this.selectWidget
      })
    }
  },
  beforeDestroy () {
    this.render.destroy && this.render.destroy()
    this.isSubscribed = false
  }
}
</script>

<style scoped lang="less">
  .widget {
    position: absolute !important;
    overflow: visible;
    transform: translate3d(0);

    &--hover:hover {
      box-shadow: 0 0 4px 2px rgba(24, 144, 255, .8) !important;
    }

    &--highlight {
      box-shadow: 0 0 2px 2px rgba(255 ,5, 5, 1) !important;
    }

    &--sub-active {
    opacity: .6;
    box-shadow: 0 0 4px 2px rgba(24, 144, 255, .8) !important;
  }
  }

</style>
