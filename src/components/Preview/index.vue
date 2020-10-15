/**
* 视图预览
* Author: dong xing
* Date: 2020/4/10
* Time: 14:49
* Email: dong.xing@outlook.com
*/

<template>
  <transition name="preview">
    <div class="Preview" v-if="visible">

      <p class="Preview__title">
        <!-- <a-icon type="left" /> -->
        {{ title }}
      </p>

      <a-spin :spinning="isViewConfigLoading">
        <a-icon slot="indicator" type="loading" style="font-size: 32px" />
        <div class="Preview__renderer" ref="wrap">

          <Renderer v-if="view && !isViewConfigLoading" :view="view" :timeRange="timeRange" ref="renderer" />

        </div>
      </a-spin>

      <!-- S 控制条 -->
      <div class="Preview__control">

        <template v-if="!isDesignMode">
          <a-tooltip placement="top" title="上一个" v-show="viewList && viewList.length">
            <a-icon type="left" @click="preView" />
          </a-tooltip>

          <a-tooltip placement="top" :title="isAutoPlay ? '暂停' : '播放'" v-show="viewList && viewList.length">
            <a-icon :type="isAutoPlay ? 'pause-circle' : 'play-circle'" @click="toggleAutoPlay" />
          </a-tooltip>

          <a-tooltip placement="top" title="下一个" v-show="viewList && viewList.length">
            <a-icon type="right" @click="nextView" />
          </a-tooltip>
        </template>

        <!--        <a-tooltip placement="top" title="时间轴">-->
        <!--          <a-icon type="clock-circle" />-->
        <!--        </a-tooltip>-->

        <a-tooltip placement="top" title="等宽">
          <a-icon type="column-width" :class="{ 'Preview__control--active': scaleMode === 'fullWidth' }" @click="setScaleMode('fullWidth')"/>
        </a-tooltip>

        <a-tooltip placement="top" title="等高">
          <a-icon type="column-height" :class="{ 'Preview__control--active': scaleMode === 'fullHeight' }" @click="setScaleMode('fullHeight')"/>
        </a-tooltip>

        <a-tooltip placement="top" title="拉伸">
          <a-icon type="swap" :class="{ 'Preview__control--active': scaleMode === 'fullscreen' }" @click="setScaleMode('fullscreen')"/>
        </a-tooltip>

        <a-tooltip placement="top" title="原始">
          <a-icon type="pic-center" :class="{ 'Preview__control--active': scaleMode === 'primary' }" @click="setScaleMode('primary')"/>
        </a-tooltip>

        <a-tooltip placement="top" title="自适应">
          <a-icon type="border-outer" :class="{ 'Preview__control--active': scaleMode === 'auto' }" @click="setScaleMode('auto')"/>
        </a-tooltip>

        <a-tooltip placement="top" :title="isFullScreen ? '退出全屏' : '全屏'">
          <a-icon :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'" @click="toggleFullscreen" />
        </a-tooltip>

        <a-tooltip placement="top" title="生成并上传缩略图" v-if="isDesignMode">
          <a-spin spinning v-if="isThumbnailUploadLoading" />
          <a-icon v-else type="camera" @click="makeThumbnail" />
        </a-tooltip>

        <a-tooltip placement="top" title="关闭" v-if="!disableClose">
          <a-icon type="close-circle" @click="$emit('update:visible', false)" />
        </a-tooltip>

      </div>
      <!-- E 控制条 -->

    </div>
  </transition>
</template>

<script>
import _ from 'lodash'
import { ViewDesignService } from '@/api-hasura'
import { updateViewThumbnail } from '@/api/controller/View'
import Renderer from '@/components/Renderer'
import PreviewMixin from '@/components/PreviewMixin'
import Timeout from 'await-timeout'
import html2canvas from 'html2canvas'

export default {
  name: 'ViewPreview',
  mixins: [PreviewMixin],
  components: {
    Renderer
  },
  props: {
    // 打开时自动全屏
    autoFullScreen: {
      type: Boolean,
      default: false
    },
    disableClose: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    viewList: {
      type: Array,
      default: () => ([])
    },
    currentView: {
      type: Object,
      default: () => ({})
    },
    // 是否在视图设计中预览，反之为在视图展示中预览
    isDesignMode: {
      type: Boolean,
      default: false
    },
    timeRange: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    // 加载视图配置
    isViewConfigLoading: false,
    // 上传缩略图
    isThumbnailUploadLoading: false
  }),
  computed: {
    title () {
      if (this.isDesignMode) {
        return _.get(this.$route.query, 'title')
      }

      if (_.isEmpty(this.viewList)) {
        return _.get(this, ['currentView', 'view_title'])
      }

      return _.get(this, ['view', 'view_title'], this.viewList[this.index].view_title)
    }
  },
  watch: {
    visible (visible) {
      visible ? this.show() : this.close()
    }
  },
  methods: {
    show () {
      this.autoFullScreen && !this.isFullScreen && this.toggleFullscreen()
      this.view = null
      if (this.isDesignMode) {
        this.getViewConfigFromStore()
      } else {
        const idList = this.viewList.map(view => view.view_id)
        this.index = idList.indexOf(this.currentView.view_id)
        this.getViewConfigFromApi(this.currentView.view_id)
      }
    },
    close () {
      this.autoFullScreen && this.isFullScreen && this.toggleFullscreen()
      clearInterval(this.timer)
    },
    /**
     * 获取视图配置
     * @param id
     * @returns {Promise<void>}
     */
    async getViewConfigFromApi (id) {
      try {
        this.isViewConfigLoading = true
        this.view = await ViewDesignService.getDesign(id)
      } catch (e) {
        this.view = null
        throw e
      } finally {
        await Timeout.set(300)
        this.isViewConfigLoading = false
      }
    },
    async getViewConfigFromStore () {
      this.view = null
      this.isViewConfigLoading = true
      await Timeout.set(300)
      this.view = this.$store.state.screen.view.getEctypalOption()
      this.isViewConfigLoading = false
    },
    /**
     * 上一个视图
     */
    preView () {
      this.index -= 1
      this.getViewByIndex()
    },
    /**
     * 下一个视图
     */
    nextView () {
      this.index += 1
      this.getViewByIndex()
    },
    /**
     * 根据编号获取视图
     */
    getViewByIndex () {
      // 清空先前的数据
      this.view = null
      const length = this.viewList.length
      if (this.index < 0) {
        this.index = length - 1
      } else if (this.index > length - 1) {
        this.index = 0
      }
      const view = this.viewList[this.index]
      this.getViewConfigFromApi(view.view_id)
    },
    /**
     * 生成并上传缩略图
     */
    async makeThumbnail () {
      this.isThumbnailUploadLoading = true
      const canvas = await html2canvas(this.$el)
      canvas.toBlob(blob => {
        const file = new File([blob], `${this.title}.png`, { lastModified: `${Date.now()}` })
        updateViewThumbnail(file, this.currentView.view_id || this.$route.query.id)
          .then(() => {
            this.$notification.success({
              message: '系统提示',
              description: '上传缩略图成功'
            })
          })
          .finally(() => {
            this.isThumbnailUploadLoading = false
          })
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less">
.Preview {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: stretch;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background: white;

  &__title {
    flex: none;
    height: 45px;
    width: 100%;
    margin: 0;
    padding: 0 16px;
    line-height: 45px;
    font-weight: bold;
    font-size: 16px;
    border-bottom: 1px solid #757575;
  }

  &__renderer {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    height: calc(100vh - 45px);
    width: 100vw;
    overflow: auto;
  }

  &__control {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: calc(50% - 300px);
    height: 48px;
    width: 600px;
    background: #636872;
    border-radius: 48px 48px 0 0;
    transform: translateY(37px);
    transition: transform .3s;

    &:hover {
      transform: translate(0);
      transition: transform .3s;
    }

    & > i {
      font-size: 24px;
      color: white;
      cursor: pointer;

      &:hover {
        color: lighten(#1890ff, 10%);
      }

      &:active {
        color: #1890ff;
      }
    }

    &--active {
      color: #1890ff !important;
    }
  }
}
</style>

<style scoped lang="less">
@import url('./transition.less');
</style>
