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
      // 保证 keep-alive deactivated 期间组件数据依旧正常绑定
      return this.isFrozen ? this.cloneConfig : _.cloneDeep(this.activeWidget.config)
    },
    isFrozen () {
      return _.get(this, ['activeWidget', 'config', 'type']) !== _.get(this, ['cloneConfig', 'type'])
    }
  },
  methods: {},
  created () {
    this.cloneConfig = _.cloneDeep(this.activeWidget.config)
  }
}
</script>

<style lang="less">

</style>
