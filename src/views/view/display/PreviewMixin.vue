<script>
import _ from 'lodash'
import defaultPreviewImg from '@/assets/images/view__preview_default.jpg'
import { ViewDesignService } from '@/api-hasura'

export default {
  mixins: [],
  components: {},
  props: {},
  data: () => ({
    // 页签模式下当前正在预览的视图id
    activeKey: null,
    // 当前正在预览的视图
    view: null,
    // 是否全屏展示
    isFullScreen: false,
    // 是否自动切换视图
    isAutoPlay: false,
    // 是否正在加载视图配置
    isLoadingViewConfig: false,
    // 是否启用缩略图模式 | 页签模式
    isThumbnailMode: true,
    // 页签模式下当前正在播放的视图下标
    index: 0,
    // TODO: 视图数据要查询的时间范围
    timeRange: []
  }),
  filters: {
    // 缩略图静态资源地址
    thumbnail (src) {
      return src ? `${process.env.VUE_APP_VIEW_THUMBNAIL_URI}/${src}` : defaultPreviewImg
    }
  },
  computed: {
    // 预览页面缩放模式
    scaleMode: {
      get: function () {
        return _.get(this.view, ['config', 'proprietaryConfig', 'scaleMode'], 'auto')
      },
      set: function (scaleMode) {
        _.set(this.view, ['config', 'proprietaryConfig', 'scaleMode'], scaleMode)
      }
    }
  },
  methods: {
    dateChange () {},
    dateSet () {},
    /**
     * 设置缩放模式
     * @param scaleMode
     */
    setScaleMode (scaleMode) {
      this.scaleMode = scaleMode
      this.$refs.renderer.setScaleMode()
    },
    /**
     * 开启轮训
     */
    startAutoPlay () {
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
     * 切换查看模式
     * 缩略图 | 页签
     */
    toggleThumbnailMode () {
      this.isThumbnailMode = !this.isThumbnailMode
      if (!this.isThumbnailMode) {
        // 从当前视图列表第一项开始自动播放
        this.tabsChange(this.filterViewList[0].view_id)
      } else {
        clearInterval(this.timer)
      }
    },
    /**
     * 页签模式下切换到指定视图
     * @param viewId
     */
    async tabsChange (viewId) {
      try {
        this.activeKey = viewId
        this.view = null
        this.isLoadingViewConfig = true
        this.view = await ViewDesignService.getDesign(viewId)
      } catch (e) {
        this.view = null
        throw e
      } finally {
        this.isLoadingViewConfig = false
      }
    },
    /**
     * 根据下标获取视图
     */
    getViewByIndex () {
      // 清空先前的数据
      this.view = null
      const { length } = this.filterViewList
      if (this.index < 0) {
        this.index = length - 1
      } else if (this.index > length - 1) {
        this.index = 0
      }
      const view = this.filterViewList[this.index]
      this.tabsChange(view.view_id)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less">
.ViewDisplay {

  &-bar {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: center;
    height: 45px;
    width: 240px;

    & i {
      font-size: 18px;
    }

    &--active {
      color: #1890ff !important;
    }
  }

  &-tabs.fullscreen {
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: 1000;
    background: white;
  }

  &-tab-content {
    width: 100%;
    height: calc(100vh - 230px);
    overflow: auto;
  }

  &-tab-content.fullscreen {
    height: 100%;
  }

}
</style>
