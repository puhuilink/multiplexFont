<template>
  <div class="Ci">
    TODO
    <!-- <ResourceTree
      withInstance
      readOnly
      draggable
      :rootKeys="['CommonCi']"
      @dragend="dragend"
    /> -->
  </div>
</template>

<script>
// import { ResourceTree } from '@/components/Resource'
import Factory from '@/model/factory/factory'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import { Range } from '@/model/common'
import IconPicker from '@/components/IconPicker'
import { NODE_TYPE_CI_CIRCLE } from '@/model/factory/nodeFactory'

export default {
  name: 'Ci',
  components: {
    // ResourceTree
  },
  mixins: [IconPicker],
  props: {},
  data: () => ({
  }),
  computed: {
    ...mapState('screen', ['view', 'activeWidget', 'topologyEditable']),
    ...mapGetters('screen', ['widgets', 'scale'])
  },
  methods: {
    ...mapMutations('screen', {
      addWidget: ScreenMutations.ADD_WIDGET,
      activateWidget: ScreenMutations.ACTIVATE_WIDGET,
      updateTopologyConfig: ScreenMutations.UPDATE_TOPOLOGY_CONFIG
    }),
    dragend ({ event, node: { dataRef } }) {
      if (this.isWithinTopologyScope(event)) {
        const target = this.icons.find(icon => icon.name === dataRef.icon)
        const other = this.icons.find(icon => icon.name === 'Others')
        const icon = target || other
        const data = {
          height: 64,
          label: dataRef.title,
          radius: '50%',
          shape: NODE_TYPE_CI_CIRCLE,
          width: 64,
          icon: {
            name: icon.name,
            height: 64,
            img: icon.img,
            position: 'inside',
            show: true,
            width: 64
          },
          style: {
            fill: 'rgba(24,144,255,0)',
            lineWidth: 0,
            radius: 0,
            stroke: 'rgba(145,213,255, 0)'
          },
          nodeDynamicDataConfig: {
            resourceConfig: {
              // TODO: 写入 model 与 instance
              model: '',
              selectedInstance: [],
              selectedKpi: [],
              selectedAttr: []
            }
          }
        }

        const { render } = this.activeWidget
        const graph = render.chart
        const { pageX, pageY } = event
        // 将屏幕/页面坐标转换为视口坐标
        const topologyCoordinate = graph.getPointByClient(pageX, pageY)
        const nodeFactory = Factory.createNodeFactory()
        const node = nodeFactory.create({
          ...data,
          x: topologyCoordinate.x,
          y: topologyCoordinate.y,
          size: [data.width, data.height]
        })
        // 添加节点
        graph.addItem('node', node)
        // 同步配置
        this.updateTopologyConfig()
      }
    },
    /**
     * 鼠标是否在拓扑部件内
     * @param pageX
     * @param pageY
     * @returns {boolean|boolean}
     */
    isWithinTopologyScope ({ pageX, pageY }) {
      const { xRange, yRange } = this.getTopologyArea()
      return (pageX >= xRange.min && pageX <= xRange.max) &&
        (pageY >= yRange.min && pageY <= yRange.max)
    },
    /**
     * 获取拓扑部件区域信息
     * @returns {{xRange: *, yRange: *}}
     */
    getTopologyArea () {
      const [container] = document.getElementsByClassName('view')
      const { x, y, width, height } = container.getBoundingClientRect()
      return {
        xRange: new Range(x, x + width),
        yRange: new Range(y, y + height)
      }
    }
  }
}
</script>

<style lang="less">
.Ci {
  overflow: auto;
}
</style>
