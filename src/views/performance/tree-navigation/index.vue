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
            <PerformanceList :where="where" v-show="dataRef" />
            <a-empty v-show="!dataRef" description="请在左侧资源树选择具体设备" />
          </a-tab-pane>

          <!-- / 视图 -->
          <a-tab-pane key="2" tab="视图" forceRender class="TreeNavigation__content">
            <div class="TreeNavigation__renderer">
              <a-spin size="large" :spinning="spinning">
                <Renderer :view="view" v-if="view" />
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
import PerformanceList from '@/components/Performance/List'
import Renderer from '@/components/Renderer'
import { CmdbHostViewService, ViewDesignService } from '@/api-hasura'
import Timeout from 'await-timeout'
import _ from 'lodash'

export default {
  name: 'TreeNavigation',
  mixins: [],
  components: {
    CmdbTree,
    PerformanceList,
    Renderer
  },
  props: {},
  data: () => ({
    dataRef: null,
    tabIndex: '1',
    spinning: false,
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
          host_type: t_model_host_type
        } = this.dataRef
        this.spinning = true
        this.viewId = await CmdbHostViewService.viewIdByHost({ t_cmdb_host_id, t_model_host_type })
        if (!this.viewId) {
          throw new Error('当前设备未关联视图')
        }
        this.view = await ViewDesignService.getDesign(this.viewId)
        this.viewError = false
      } catch (e) {
        this.viewId = null
        this.view = null
        this.viewError = true
        throw e
      } finally {
        // 预留时间给动画与视图动态数据加载
        await Timeout.set(300)
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
    // FIXME: max 不生效
    // height: max(calc(100vh - 190px), 100px) !important;
    height: calc(100vh - 190px);
    overflow: auto;
  }

  &__renderer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

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
