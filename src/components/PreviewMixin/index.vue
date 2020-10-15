<script>
import _ from 'lodash'

export default {
  mixins: [],
  components: {},
  props: {},
  data: () => ({
    // 是否自动切换视图
    isAutoPlay: false,
    // 是否全屏展示
    isFullScreen: false,
    // 当前正在播放的视图下标
    index: 0,
    // 当前正在预览的视图
    view: null
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
     * 设置缩放模式
     * @param scaleMode
     */
    setScaleMode (scaleMode) {
      this.scaleMode = scaleMode
      this.$refs.renderer.setScaleMode()
    },
    /**
     * 切换全屏
     */
    toggleFullscreen () {
      this.isFullScreen = !this.isFullScreen
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    },
    /**
     * 切换自动播放
     */
    toggleAutoPlay () {
      this.isAutoPlay = !this.isAutoPlay
      clearInterval(this.timer)
      // 开启定时器。每分钟切换视图
      if (this.isAutoPlay) {
        this.timer = setInterval(() => {
          // 运行时
          if (this.isAutoPlay) {
            this.index += 1
            this.getViewByIndex()
          }
        }, 1000 * 6)
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less">

</style>
