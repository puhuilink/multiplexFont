/**
* 视图预览
* Author: dong xing
* Date: 2020/4/10
* Time: 14:49
* Email: dong.xing@outlook.com
*/

<template>
  <transition name="preview">
    <div class="view-preview" v-if="visible">

      <p class="view-preview__title">{{ title }}</p>

      <a-spin :spinning="isLoading">
        <a-icon slot="indicator" type="loading" style="font-size: 32px" />
        <div class="view-preview__renderer" ref="wrap">

          <Renderer v-if="view" :view="view" ref="renderer" />

        </div>
      </a-spin>

      <!-- S 控制条 -->
      <div class="view-preview__control">

        <template v-if="!isDesignMode">
          <a-tooltip placement="top" title="上一个">
            <a-icon type="left" @click="preView" />
          </a-tooltip>

          <a-tooltip placement="top" :title="isPolling ? '暂停' : '播放'">
            <a-icon :type="isPolling ? 'pause-circle' : 'play-circle'" @click="startPolling" />
          </a-tooltip>

          <a-tooltip placement="top" title="下一个">
            <a-icon type="right" @click="nextView" />
          </a-tooltip>
        </template>

        <!--        <a-tooltip placement="top" title="时间轴">-->
        <!--          <a-icon type="clock-circle" />-->
        <!--        </a-tooltip>-->

        <a-tooltip placement="top" title="等宽">
          <a-icon type="column-width" :class="{ 'view-preview__control--active': scaleMode === 'fullWidth' }" @click="setScaleMode('fullWidth')"/>
        </a-tooltip>

        <a-tooltip placement="top" title="等高">
          <a-icon type="column-height" :class="{ 'view-preview__control--active': scaleMode === 'fullHeight' }" @click="setScaleMode('fullHeight')"/>
        </a-tooltip>

        <a-tooltip placement="top" title="拉伸">
          <a-icon type="swap" :class="{ 'view-preview__control--active': scaleMode === 'fullscreen' }" @click="setScaleMode('fullscreen')"/>
        </a-tooltip>

        <a-tooltip placement="top" title="原始">
          <a-icon type="pic-center" :class="{ 'view-preview__control--active': scaleMode === 'primary' }" @click="setScaleMode('primary')"/>
        </a-tooltip>

        <a-tooltip placement="top" title="自适应">
          <a-icon type="border-outer" :class="{ 'view-preview__control--active': scaleMode === 'auto' }" @click="setScaleMode('auto')"/>
        </a-tooltip>

        <a-tooltip placement="top" :title="isFullscreen ? '退出全屏' : '全屏'">
          <a-icon :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'" @click="fullscreen" />
        </a-tooltip>

        <a-tooltip placement="top" title="关闭">
          <a-icon type="close-circle" @click="close" />
        </a-tooltip>

      </div>
      <!-- E 控制条 -->

    </div>
  </transition>
</template>

<script>
import _ from 'lodash'
import { getViewDesign } from '@/api/controller/View'
import Renderer from '@/components/Renderer'
import Timeout from 'await-timeout'

export default {
  name: 'ViewPreview',
  components: {
    Renderer
  },
  props: {
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
    }
  },
  data: () => ({
    isLoading: false,
    isFullscreen: false,
    isPolling: false,
    index: 0,
    view: null,
    timer: null
  }),
  computed: {
    scaleMode: {
      get: function () {
        return this.view ? _.get(this.view, 'config.proprietaryConfig.scaleMode') : 'auto'
      },
      set: function (mode) {
        Object.assign(this.view.config.proprietaryConfig, {
          scaleMode: mode
        })
      }
    },
    title: {
      get () {
        if (this.isDesignMode) {
          return _.get(this.$route.query, 'title')
        } else {
          return this.viewList[this.index].view_name
        }
      }
    }
  },
  methods: {
    /**
     * 关闭弹框
     */
    close () {
      this.$emit('update:visible', false)
    },
    /**
     * 开启全屏
     */
    fullscreen () {
      this.isFullscreen = !this.isFullscreen
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    },
    /**
     * 获取视图配置
     * @param id
     * @returns {Promise<void>}
     */
    async getViewConfigFromApi (id) {
      try {
        this.isLoading = true
        this.view = await getViewDesign(id)
      } catch (e) {
        this.view = null
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async getViewConfigFromStore () {
      this.isLoading = true
      await Timeout.set(300)
      // 当从设计页面进入时，此时的 view 与 widgets 已有全局唯一 id
      const option = _.cloneDeep(
        this.$store.state.screen.view.getOption()
      )
      option.id += '-copy'
      option.widgets.forEach(widget => {
        widget.widgetId += '-copy'
      })
      this.view = option
      this.isLoading = false
    },
    /**
     * 设置缩放模式
     * @param scaleMode
     */
    setScaleMode (scaleMode) {
      this.scaleMode = scaleMode
      this.$refs.renderer.setScaleMode()
    },
    /**
     * 上一个视图
     */
    preView () {
      this.index -= 1
      this.getIndexView()
    },
    /**
     * 下一个视图
     */
    nextView () {
      this.index += 1
      this.getIndexView()
    },
    /**
     * 开启轮训
     */
    startPolling () {
      this.isPolling = !this.isPolling
      clearInterval(this.timer)
      // 开启定时器。每分钟切换视图
      if (this.isPolling) {
        setInterval(() => {
          if (this.isPolling) {
            this.index += 1
            this.getIndexView()
          }
        }, 1000 * 6)
      }
    },
    /**
     * 根据编号获取视图
     * @param index
     */
    getIndexView () {
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
    }
  },
  watch: {
    visible (v) {
      if (v) {
        this.view = null
        if (this.isDesignMode) {
          this.getViewConfigFromStore()
        } else {
          const idList = this.viewList.map(view => view.view_id)
          this.index = idList.indexOf(this.currentView.view_id)
          this.getViewConfigFromApi(this.currentView.view_id)
        }
      } else {
        clearInterval(this.timer)
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="less">
.view-preview {
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

  &:hover &__control {
    display: flex;
  }

  &__control {
    display: none;
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
.preview-enter-active, .preview-leave-active {
  transition: all 0.3s;
}

.preview-enter {
  opacity: 0;
  transform: translateY(-300px);
}
.preview-leave-to {
  opacity: 0;
  transform: translateY(300px);
}
</style>
