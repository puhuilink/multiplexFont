<template>
  <div class="Ci">
    <!-- TODO: 只有 host 节点才允许 draggable -->
    <CmdbTree
      draggable
      @dragend="dragend"
    />
  </div>
</template>

<script>
import { CmdbTree } from '@/components/Resource'
import Factory from '@/model/factory/factory'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import { Range } from '@/model/common'
import IconPicker from '@/components/IconPicker'
import { CmdbService } from '@/api'
import {
  NODE_TYPE_CIRCLE
} from '@/plugins/g6-types'

export default {
  name: 'Ci',
  components: {
    CmdbTree
  },
  mixins: [IconPicker],
  props: {},
  data: () => ({}),
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
    async dragend ({ event, node: { dataRef } }) {
      if (this.isWithinTopologyScope(event)) {
        // TODO: Icon mapping
        const {
          hostId,
          deviceModelName = 'Others',
          ...resourceConfig
        } = await CmdbService.flatInfoByHostId(dataRef.id)
        const icon = this.icons.find(({ name = '', alias = [] }) => name === deviceModelName || alias.includes(deviceModelName)) || this.defaultIcon
        const data = {
          height: 64,
          label: dataRef.alias,
          radius: '50%',
          shape: NODE_TYPE_CIRCLE,
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
          resourceConfig: {
            ...resourceConfig,
            hostId: [hostId]
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

<style lang="less" scoped>
.Ci {
  padding: 0 4px;
  overflow: auto;
}
</style>
