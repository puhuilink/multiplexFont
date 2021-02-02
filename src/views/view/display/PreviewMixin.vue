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
  computed: {},
  methods: {
    thumbnail (src) {
      return src ? `${process.env.VUE_APP_VIEW_THUMBNAIL_URI}/${src}` : defaultPreviewImg
    },
    dateChange () {},
    dateSet () {},
    /**
     * 切换查看模式
     * 缩略图 | 页签
     */
    toggleThumbnailMode (els) {
      if (els === 'thumbnail') {
        this.isThumbnailMode = true
        this.tabsChange(this.filterViewList[0].view_id)
      } else if (els === 'tabsPags') {
        this.isThumbnailMode = false
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
