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
    :class="[onlyShow ? 'widget' : 'widget widget--hover']"
    :id="widget.widgetId"
    :ref="widget.widgetId"
    @click.stop="() => $emit('select', selectWidget)">

    <!-- S 元素部件 -->
    <component v-if="useComponent" :is="elementName" :elementProps="elementProps" ref="element" />
    <!-- E 元素部件 -->

  </div>
</template>

<script>
import _ from 'lodash'
import { mapMutations } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import { ELEMENTS, ELEMENT_MAPPING } from '../Elements'
import Factory from '@/model/factory/factory'
import Widget from '@/model/widget'
import { TIME_RANGE_TYPE_CUSTOM } from '@/model/config/dataConfig/dynamicData/common/TimeRangeConfig'
import TopologyChart from '@/model/charts/TopologyChart'
import { NODE_CI_DRILL_TYPE_VIEW } from '@/model/nodes'
import { NODE_TYPE_CIRCLE, NODE_TYPE_CI_CIRCLE, NodeFactory } from '@/model/factory/nodeFactory'
import { SOURCE_TYPE_REAL } from '@/model/config/dataConfig/dynamicData/types/sourceType'

export default {
  name: 'Widget',
  components: {
    ...ELEMENTS
  },
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
    render: null
  }),
  computed: {
    // 选择的部件
    selectWidget () {
      return Object.assign(this.widget, { render: this.render })
    },
    // 在类型为元素时使用组件进行渲染
    useComponent () {
      return this.widget.config.category === 'ELEMENT'
    },
    // 元素组件名
    elementName () {
      return ELEMENT_MAPPING.get(this.widget.config.type)
    },
    // 元素配置
    elementProps () {
      return this.widget.config.proprietaryConfig.props
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
      // if (model.shape === NODE_TYPE_CI_CIRCLE) {}
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
      const { chart, config } = render
      const { proprietaryConfig: { nodes } } = config
      chart.on('node:click', this.drill)
      // 筛选出需要定时刷新的节点，如果节点只存储了配置，需要将其实例化
      const circleNodeList = nodes.filter(({ shape }) => [NODE_TYPE_CIRCLE, NODE_TYPE_CI_CIRCLE].includes(shape)).map(node => NodeFactory.create(node))
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
      element: this.$refs.element && this.$refs.element.$el
    })
    if (this.onlyShow) {
      // 如果在视图展示状态下，组件（轮询）动态加载数据
      this.render.intervalRefresh && this.render.intervalRefresh()
      if (this.render instanceof TopologyChart) {
        // TODO: 待调试
        // this.initTopologyChart()
      }
    }
  },
  beforeDestroy () {
    this.render.destroy && this.render.destroy()
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
  }

</style>
