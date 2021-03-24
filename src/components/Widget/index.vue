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
    <Component
      ref="element"
      :is="elementName"
      v-if="useComponent"
    />

    <AlarmPopupDetails ref="alarmSchema" ></AlarmPopupDetails>

  </div>
</template>

<script>
// import _ from 'lodash'
import { mapMutations, mapState } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import Factory from '@/model/factory/factory'
import Widget from '@/model/widget'
import TopologyChart from '@/model/charts/TopologyChart'
// import { NODE_CI_DRILL_TYPE_VIEW } from '@/model/nodes'
import { NODE_TYPE_CIRCLE } from '@/plugins/g6-types'
import { ELEMENTS, ELEMENT_MAPPING } from '../Elements'
import AlarmPopupDetails from '@/components/Alarm/AlarmPopup/AlarmPopupDetails.vue'

const nodeFactory = Factory.createNodeFactory()

export default {
  name: 'Widget',
  components: {
    ...ELEMENTS,
    AlarmPopupDetails
  },
  props: {
    widget: {
      type: Object,
      default: () => ({})
    },
    onlyShow: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    render: null,
    isSubscribed: true
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
    },
    // 元素组件名
    elementName () {
      return ELEMENT_MAPPING.get(this.widget.config.type)
    }
  },
  methods: {
    ...mapMutations('screen', {
      activateWidget: ScreenMutations.ACTIVATE_WIDGET
    }),
    /**
     * 拓扑节点钻取事件
     */

    // drillFromNode ({ item }) {
    //   const drillConfig = { drillType: NODE_CI_DRILL_TYPE_VIEW, viewList: [9401] }
    //   this.$emit('drill', _.cloneDeep(drillConfig))
    // },

    drillFromNode (node) {
      // 判断是否有圆形有警告
      const m = node.item.getModel()
      const drillAlarm = []
      if (m.alarmLevel !== undefined) {
        drillAlarm.push({
          alarmLevel: m.alarmLevel,
          hostId: m.resourceConfig.hostId[0]
        })
        this.$refs['alarmSchema'].add(drillAlarm)
      }
    },

    initTopologyChart () {
      const { render } = this
      const {
        chart,
        config: { proprietaryConfig }
      } = render
      chart.on('node:click', this.drillFromNode)
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
    },
    /**
     * 通过配置初始化Widget
     */
    initWidgetFromConfig () {
      if (!(this.widget instanceof Widget)) {
        Object.assign(this.widget, new Widget(this.widget))
      }
    }
  },
  mounted () {
    this.initWidgetFromConfig()
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
