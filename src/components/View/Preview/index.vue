<template>
  <div class="preview" :style="styles">

    <template v-if="loading">
      <a-spin spinning></a-spin>
    </template>

    <template v-else>
      <Renderer
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

<style scoped>
.preview {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
  height: 100vh;
  width: 100vw;
}
</style>
