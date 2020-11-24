<script>
import Timeout from 'await-timeout'
import _ from 'lodash'

export default {
  name: 'Drill',
  mixins: [],
  components: {},
  props: {},
  data: () => ({
    isDrilled: false,
    // 钻取历史队列
    viewDrillList: []
  }),
  computed: {},
  methods: {
    resetDrillConfig () {
      this.isDrilled = false
      this.viewDrillList = []
    },
    async goBack () {
      this.viewDrillList.pop()
      const view = _.last(this.viewDrillList)
      if (view) {
        this.isViewConfigLoading = true
        await Timeout.set(300)
        this.view = view
        this.isViewConfigLoading = false
      } else {
        this.$emit('update:visible', false)
      }
    },
    onDrill ({ viewId }) {
      if (!this.isDrilled) {
        this.isDrilled = true
        // 默认配置加入钻取队列
        this.viewDrillList.push(this.view)
      }
      this
        .getViewConfigFromApi(viewId)
        .then(() => this.viewDrillList.push(this.view))
    }
  }
}
</script>

<style lang="less">

</style>
