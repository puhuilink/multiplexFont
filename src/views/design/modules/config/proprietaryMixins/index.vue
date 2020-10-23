/**
* 专有属性配置及更新
* Author: dong xing
* Date: 2020/3/20
* Time: 10:12
* Email: dong.xing@outlook.com
*/

<script>
import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'
import { ScreenMutations } from '@/store/modules/screen'
import CacheMixin from '../cache'

export default {
  name: 'ProprietaryMixins',
  mixins: [CacheMixin],
  computed: {
    ...mapState('screen', [
      'activeWidget',
      'topologyEditable',
      'activeNode',
      'activeEdge',
      'edgeConfig'
    ])
  },
  methods: {
    ...mapMutations('screen', {
      activateWidget: ScreenMutations.ACTIVATE_WIDGET,
      removeWidget: ScreenMutations.REMOVE_WIDGET,
      updateTopologyConfig: ScreenMutations.UPDATE_TOPOLOGY_CONFIG,
      updateNode: ScreenMutations.ACTIVATE_NODE

    }),
    change () {
      const activeWidget = _.cloneDeep(this.activeWidget)
      const { render } = this.activeWidget
      this.activateWidget({
        widget: Object.assign(activeWidget, { config: this.config })
      })
      this.$nextTick(() => {
        render.mergeOption(this.config)
      })
    }
  }
}
</script>
