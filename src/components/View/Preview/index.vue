<template>
  <div class="preview" :style="styles">

    <template v-if="loading">
      <a-spin spinning size="large"></a-spin>
    </template>

    <template v-else>
      <Renderer
        class="preview__renderer"
        v-if="preview"
        :ciId="ciId"
        :view="preview"
      />
    </template>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import Renderer from '@/components/Renderer'
import { ViewDesignService } from '@/api-hasura'
import Timeout from 'await-timeout'

export default {
  name: 'Preview',
  props: {
    viewId: {
      type: Number,
      required: false,
      default: 0
    },
    styles: {
      type: Object,
      default: () => ({})
    },
    ciId: {
      type: String,
      default: ''
    }
  },
  components: {
    Renderer
  },
  data: () => ({
    preview: null,
    loading: false
  }),
  computed: {
    ...mapState('screen', ['view'])
  },
  watch: {
    ciId () {
      this.fetch()
    }
  },
  methods: {
    async fetch () {
      try {
        this.loading = true
        this.preview = this.viewId ? await ViewDesignService.getDesign(this.viewId) : this.view.getOption()
      } catch (e) {
        throw e
      } finally {
        // 触发 v-if 强制更新
        await Timeout.set(100)
        await this.$nextTick()
        this.loading = false
      }
    }
  },
  async created () {
    this.fetch()
  }
}
</script>

<style scoped lang="less">
.preview {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  height: calc(100vh - 110px);
  // height: 100vh;
  // widows: 100vw;

  .ant-spin {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
}
</style>
