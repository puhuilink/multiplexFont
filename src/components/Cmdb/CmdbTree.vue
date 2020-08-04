<template>
  <div class="CmdbTree">
    <a-spin :spinning="spinning">
      <a-tree :treeData="treeData" />
    </a-spin>
  </div>
</template>

<script>
import { CmdbService } from '@/api-hasura'

export default {
  name: 'CmdbTree',
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
        this.treeData = await CmdbService.cmdbTree()
      } catch (e) {
        this.treeData = []
        throw e
      } finally {
        this.spinning = false
      }
    }
  },
  created () {
    console.log(111)
    this.fetch()
  }
}
</script>

<style lang="less">

</style>
