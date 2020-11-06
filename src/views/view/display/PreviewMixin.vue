<script>
import defaultPreviewImg from '@/assets/images/view__preview_default.jpg'
import { ViewDesignService } from '@/api'
import PreviewMixin from '~~~/PreviewMixin'

export default {
  mixins: [PreviewMixin],
  components: {},
  props: {},
  data: () => ({
    // 页签模式下当前正在预览的视图id
    activeKey: null,
    // 是否正在加载视图配置
    isLoadingViewConfig: false,
    // 是否启用缩略图模式 | 页签模式
    isThumbnailMode: true,
    // TODO: 视图数据要查询的时间范围
    timeRange: []
  }),
  filters: {
    // 缩略图静态资源地址
    thumbnail (src) {
      return src ? `${process.env.VUE_APP_VIEW_THUMBNAIL_URI}/${src}` : defaultPreviewImg
    }
  },
  computed: {},
  methods: {
    dateChange () {},
    dateSet () {},
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
