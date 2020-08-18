<template>
  <div class="CmdbTree">
    <a-input-search
      allowClear
      class="CmdbTree__search"
      :loading="spinning"
      placeholder="搜索"
      @search="onSearch"
    />
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
      />
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
    expandedKeys: [],
    spinning: false,
    treeData: []
  }),
  computed: {},
  methods: {
    async fetch (where = {}) {
      try {
        this.spinning = true
        this.treeData = await CmdbService.resourceTree(where)
        // 默认展开两层
        this.expandedKeys = [
          'root',
          ...this.searchValue ? this.treeData[0].children.map(({ id }) => id) : []
        ]
        // FIXME: 需要到第三层
      } catch (e) {
        this.treeData = []
        this.expandedKeys = []
        throw e
      } finally {
        this.spinning = false
      }
    },
    filterTreeNode (node = {}) {
      if (this.searchValue) {
        return node.title.includes(this.searchValue)
      } else {
        return false
      }
    },
    async onSearch (e = '') {
      this.searchValue = e.trim()
      const snippet = {
        _ilike: `%${this.searchValue}%`
      }
      // 全局模糊查询
      await this.fetch({
        _or: [
          { location: snippet },
          {
            modelHost: {
              host: snippet
            }
          },
          { alias: snippet }
        ]
      })
    }
  },
  created () {
    this.fetch()
  }
}
</script>

<style lang="less">
.CmdbTree {
  &__search {
    position: sticky;
    top: 0px;
    background: #fff;
    z-index: 1;
  }
}
</style>
