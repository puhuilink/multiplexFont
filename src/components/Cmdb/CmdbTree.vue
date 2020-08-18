<template>
  <div class="CmdbTree">
    <a-spin :spinning="spinning">
      <a-tree
        :expandedKeys.sync="expandedKeys"
        :filterTreeNode="filterTreeNode"
        :replaceFields="{
          children: 'children',
          title:'alias',
          key:'id'
        }"
        showLine
        :treeData="treeData"
        v-on="$listeners"
        v-bind="$props"
      />
    </a-spin>
  </div>
</template>

<script>
import { CmdbService } from '@/api-hasura'
import { Tree } from 'ant-design-vue'

export default {
  name: 'CmdbTree',
  mixins: [],
  extends: Tree,
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
        this.treeData = await CmdbService.tree()
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
