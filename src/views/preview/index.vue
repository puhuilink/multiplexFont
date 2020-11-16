<template>
  <a-spin :spinning="globalLoading">
    <ExceptionPage :type="exceptionType" v-if="exceptionType">
      <a-button slot="actions" type="primary" :loading="btnLoading" @click="refetch">点击重试</a-button>
    </ExceptionPage>

    <!-- TODO: 浏览器全屏切换必须通过用户事件手动触发 -->
    <!-- autoFullScreen -->
    <ViewPreview
      v-else
      :currentView="view"
      disableClose
      :visible="visible"
    />
  </a-spin>
</template>

<script>
import ViewPreview from '~~~/Preview'
import { ViewListService } from '@/api'
import _ from 'lodash'
import { ExceptionPage } from '@/components'

export default {
  name: 'Preview',
  mixins: [],
  components: {
    ViewPreview,
    ExceptionPage
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    btnLoading: false,
    globalLoading: false,
    view: null,
    visible: false,
    exceptionType: null
  }),
  computed: {},
  methods: {
    async fetch () {
      const view_id = ~~this.id
      if (!view_id) {
        return
      }
      try {
        this.globalLoading = true
        const { data: { viewList } } = await ViewListService.find({
          where: { view_id },
          fields: ['view_id', 'view_title'],
          alias: 'viewList'
        })
        if (_.isEmpty(viewList)) {
          this.reset()
          this.exceptionType = '404'
        } else {
          this.view = viewList[0]
          this.visible = true
          this.exceptionType = null
        }
      } catch (e) {
        this.reset()
        this.exceptionType = '500'
        throw e
      } finally {
        this.globalLoading = false
      }
    },
    refetch () {
      this.btnLoading = true
      this.fetch().finally(() => {
        this.btnLoading = false
      })
    },
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  },
  created () {
    this.fetch()
  }
}
</script>

<style lang="less">

</style>
