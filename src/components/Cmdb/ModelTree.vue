<template>
  <div class="ModelTree">
    <a-spin :spinning="spinning">
      <a-tree :treeData="treeData" />
    </a-spin>
  </div>
</template>

<script>
import { ModelService } from '@/api-hasura'

export default {
  name: 'ModelTree',
  mixins: [],
  components: {},
  props: {},
  data: () => ({
    spinning: false,
    treeData: []
  }),
  computed: {},
  methods: {
    async fetch () {
      try {
        this.spinning = true
        this.treeData = await ModelService.tree()
      } catch (e) {
        this.treeData = []
        throw e
      } finally {
        this.spinning = false
      }
    }
  },
  created () {
    this.fetch()
  }
}
</script>

<style lang="less">

</style>
