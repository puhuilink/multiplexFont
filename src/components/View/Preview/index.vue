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
import { getViewDesign } from '@/api/controller/View'
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
    async ciId () {
      this.loading = true
      await Timeout.set(300)
      this.loading = false
    }
  },
  methods: {
    async fetch (viewviewId) {
      try {
        this.loading = true
        const option = await getViewDesign(viewviewId)
        this.loading = false
        return option
      } catch (e) {
        this.loading = false
        return null
      }
    }
  },
  async created () {
    this.preview = this.viewId ? await this.fetch(this.viewId) : this.view.getOption()
  }
}
</script>

<style scoped lang="less">
.preview {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
  height: 100vh;
  width: 100%;
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
