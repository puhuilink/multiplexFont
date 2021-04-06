<template>
  <div class="TreeNavigation">
    <a-row>

      <!-- / 左侧资源树 -->
      <a-col :xl="5" :lg="6" :md="8" :sm="0" class="TreeNavigation__col">
        <a-tabs>
          <a-tab-pane key="1" tab="资源树" class="TreeNavigation__content">
            <CmdbTree @select="onCmdbSelect" />
          </a-tab-pane>
        </a-tabs>
      </a-col>

      <!-- / 右侧正文 -->
      <a-col :xl="19" :lg="18" :md="16" :sm="24" class="TreeNavigation__col">
        <a-tabs v-model="tabIndex" @change="onTabChange">

          <!-- / 指标列表 -->
          <a-tab-pane key="1" tab="指标列表" class="TreeNavigation__content">
            <PerformanceDetail
              :hostId="dataRef.id"
              :scrollY="'max(calc(100vh - 360px), 100px)'"
              v-if="dataRef"
            />
            <a-empty v-show="!dataRef" description="请在左侧资源树选择具体设备" />
          </a-tab-pane>

          <!-- / 视图 -->
          <a-tab-pane key="2" tab="视图" forceRender class="TreeNavigation__content" :class="isFullScreen ? ['TreeNavigation__renderer-fullscreen'] : []">
            <div class="TreeNavigation__renderer">
              <a-spin size="large" :spinning="spinning">
                <div class="PreviewMixin-bar" :class="isFullScreen ? ['PreviewMixin-bar__fullscreen'] : []" v-show="view">
                  <a-tooltip placement="top" title="等宽">
                    <a-icon type="column-width" :class="{ 'PreviewMixin-bar--active': scaleMode === 'fullWidth' }" @click="setScaleMode('fullWidth')"/>
                  </a-tooltip>

                  <a-tooltip placement="top" title="等高">
                    <a-icon type="column-height" :class="{ 'PreviewMixin-bar--active': scaleMode === 'fullHeight' }" @click="setScaleMode('fullHeight')"/>
                  </a-tooltip>

                  <a-tooltip placement="top" title="拉伸">
                    <a-icon type="swap" :class="{ 'PreviewMixin-bar--active': scaleMode === 'fullscreen' }" @click="setScaleMode('fullscreen')"/>
                  </a-tooltip>

                  <a-tooltip placement="top" title="原始">
                    <a-icon type="pic-center" :class="{ 'PreviewMixin-bar--active': scaleMode === 'primary' }" @click="setScaleMode('primary')"/>
                  </a-tooltip>

                  <a-tooltip placement="top" title="自适应">
                    <a-icon type="border-outer" :class="{ 'PreviewMixin-bar--active': scaleMode === 'auto' }" @click="setScaleMode('auto')"/>
                  </a-tooltip>

                  <a-tooltip placement="top" :title="isFullScreen ? '退出全屏' : '全屏'">
                    <a-icon :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'" @click="toggleFullscreen" />
                  </a-tooltip>
                </div>
                <Renderer ref="renderer" :view="view" v-if="view" />
                <a-empty v-show="description" :description="description" />
              </a-spin>
            </div>
          </a-tab-pane>

        </a-tabs>
      </a-col>

    </a-row>
  </div>
</template>

<script>
import { CmdbTree } from '@/components/Resource'
import PerformanceDetail from '@/components/Performance/Detail.vue'
import Renderer from '@/components/Renderer'
import { ViewDesignService } from '@/api'
import _ from 'lodash'
import Preview from '@/components/Preview'

export default {
  name: 'TreeNavigation',
  mixins: [Preview],
  components: {
    CmdbTree,
    PerformanceDetail,
    Renderer
  },
  props: {},
  data: () => ({
    dataRef: null,
    hostId: null,
    spinning: false,
    tabIndex: '1',
    view: null,
    viewId: null,
    viewError: false,
    where: {}
  }),
  computed: {
    description () {
      if (this.spinning) {
        return ''
      }

      if (!this.dataRef) {
        return '请在左侧资源树选择具体设备'
      }

      if (!this.viewId) {
        return '当前设备未关联视图'
      }

      if (this.viewError) {
        return '加载视图失败'
      }

      return ''
    }
  },
  methods: {
    fetchMetricList () {
      this.where = {
        host_id: {
          _eq: this.dataRef.id
        },
        agent: {
          _eq: this.dataRef.location
        }
      }
    },
    async fetchView () {
      if (!this.dataRef) {
        return
      }
      try {
        const {
          id: t_cmdb_host_id,
          hostTypeView = {},
          hostView = {}
        } = this.dataRef
        this.spinning = true
        this.viewId = _.get(hostView, ['view_id']) || _.get(hostTypeView, ['view_id'])
        if (!this.viewId) {
          throw new Error('当前设备未关联视图')
        }
        this.hostId = t_cmdb_host_id
        this.view = await ViewDesignService.getDesign({
          view_id: this.viewId,
          host_id: t_cmdb_host_id
        })
        this.viewError = false
      } catch (e) {
        this.viewId = null
        this.view = null
        this.viewError = true
        this.hostId = null
        throw e
      } finally {
        this.spinning = false
      }
    },
    onCmdbSelect (selectedKeys = [], { selected, node: { dataRef } }) {
      this.reset()
      if (selected) {
        this.dataRef = dataRef
        this.tabIndex === '1' ? this.fetchMetricList() : this.fetchView()
      }
    },
    onTabChange (tabIndex) {
      if (tabIndex === '2') {
        !this.view && this.fetchView()
      } else if (tabIndex === '1') {
        this.fetchMetricList()
      }
    },
    reset () {
      Object.assign(
        this.$data,
        _.omit(this.$options.data.apply(this), ['tabIndex'])
      )
    }
  }
}
</script>

<style lang="less">
.TreeNavigation {

  &__col {
    padding: 0 8px;
  }

  &__content {
    min-height: 250px !important;
    height: calc(100vh - 190px) !important;
    overflow: auto;
  }

  &__renderer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    &-fullscreen {
      position: fixed;
      top: 0;
      right: 0;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 200;
      background-color: #fff;
    }

    .ant-spin-nested-loading {
      width: 100%;
      height: 100%;

      .ant-spin {
        max-height: 100%;
      }
    }

    .ant-spin-container {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
