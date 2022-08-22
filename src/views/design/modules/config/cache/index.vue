<script>
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'CacheMixins',
  mixins: [],
  components: {},
  props: {},
  data: () => ({
    cloneConfig: null
  }),
  computed: {
    ...mapState('screen', ['activeWidget']),
    config () {
      // 保证  deactivated 期间组件数据依旧正常绑定
      return this.isFrozen ? this.cloneConfig : this.activeWidget.config
    },
    isFrozen () {
      return _.get(this, ['activeWidget', 'config', 'type']) !== _.get(this, ['cloneConfig', 'type'])
    }
  },
  methods: {},
  created () {
    // 保持引用
    // TODO: 使用最小化默认配置
    this.cloneConfig = this.activeWidget.config
  }
}
</script>

<style lang="less">

</style>
