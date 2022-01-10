<script>
import _ from 'lodash'

export default {
  name: 'SelectChangeMixin',
  data: () => ({
    // 是否自动切换视图
    isAutoPlay: false,
    isFullScreen: false,
    isSubscribed: true,
    // 当前正在播放的视图下标
    index: 0
    // 当前正在预览的视图
  }),
  computed: {
    // 预览页面缩放模式
    scaleMode: {
      get () {
        return _.get(this.view, ['config', 'proprietaryConfig', 'scaleMode'], 'auto')
      },
      set (scaleMode) {
        _.set(this.view, ['config', 'proprietaryConfig', 'scaleMode'], scaleMode)
      }
    }
  },
  methods: {
    /**
     *  通过冒泡事件实现组件间的通信
     */
    async selectChanged (event) {
      const { label, value } = event
      const indexArr = []
      this.view.widgets.map((el, index, arr) => {
        if (el.config.type === 'Global') {
          indexArr.push(index)
          arr[index].config.dataConfig.dbDataConfig.ormConfig.cache = value
        }
        if (el.config.type === 'TextHealth') {
          indexArr.push(index)
          arr[index].config.dataConfig.dbDataConfig.siteTrafficConfig.siteId = value
          if (arr[index].config.dataConfig.dbDataConfig.siteTrafficConfig.isCache) {
            arr[index].config.proprietaryConfig.title.text = label
          }
        }
        if (el.config.type === 'Lines') {
          indexArr.push(index)
          arr[index].config.dataConfig.dbDataConfig.siteCpeConfig.siteId = value
          arr[index].config.dataConfig.dbDataConfig.siteTrafficConfig.cache = value
        }
        if (el.config.type === 'Tab') {
          indexArr.push(index)
          arr[index].config.dataConfig.dbDataConfig.siteTrafficConfig.siteId = value
        }
        if (el.config.type === 'More') {
          indexArr.push(index)
          arr[index].config.dataConfig.dbDataConfig.siteTrafficConfig.siteId = value
        }
      })
      this.$nextTick()
      await Promise.all(indexArr.map(async el => {
        await this.view.widgets[el].render.refresh()
      }))
    }
  }
}
</script>

<style scoped>

</style>
