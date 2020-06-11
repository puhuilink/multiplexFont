import { mapMutations, mapState } from 'vuex'
import _ from 'lodash'
import { ScreenMutations } from '@/store/modules/screen'

export default {
  computed: {
    ...mapState('screen', ['activeWidget', 'activeNode']),
    model () {
      return Object.assign(
        _.cloneDeep(this.activeNode.getModel()),
        { radius: this.activeNode.getModel().size[0] / 2 }
      )
    }
  },
  methods: {
    ...mapMutations('screen', {
      updateTopologyConfig: ScreenMutations.UPDATE_TOPOLOGY_CONFIG,
      updateNode: ScreenMutations.ACTIVATE_NODE
    }),
    /**
     * 节点数据配置更新
     */
    change (type) {
      const { render, config: { proprietaryConfig } } = this.activeWidget
      // 根据配置更新视图，由于 updateItem 方法只能更新节点配置无法更新视图icon
      render.chart.updateItem(this.model.id, this.model)

      // 更新配置
      this.updateTopologyConfig()

      if (type === 'icon') {
        // 通过上一步已经修改后的节点配置项，通过 read 方法更新整个视图以更新 icon
        render.read(proprietaryConfig)
      }

      // 更新当前节点
      this.updateNode({
        activeNode: render.chart.find('node', node => node.getModel().id === this.model.id)
      })
    }
  }
}
