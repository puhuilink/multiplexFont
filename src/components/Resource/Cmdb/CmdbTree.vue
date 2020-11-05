<template>
  <div class="CmdbTree">
    <a-input-search
      allowClear
      autoFocus
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
          title: 'alias',
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

export default {
  name: 'CmdbTree',
  mixins: [],
  components: {},
  props: {
    draggable: {
      type: Boolean,
      default: false
    }
  },
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
        this.expandedKeys = this.expandMatchNode(this.treeData[0].children)
      } catch (e) {
        this.treeData = []
        this.expandedKeys = []
        throw e
      } finally {
        this.spinning = false
      }
    },
    /**
     * 展开匹配的节点
     */
    expandMatchNode (collection = []) {
      // 默认只展开两层
      if (!this.searchValue) {
        return ['root']
      }

      // 有搜索条件时根据搜索内容匹配
      const expandedKeys = ['root']

      const recursive = (children = []) => {
        children.forEach(node => {
          // 匹配则不展开，反之展开并进入其子节点寻找匹配节点
          if (!this.filterTreeNode(node)) {
            expandedKeys.push(node.id)
            recursive(node.children || [])
          }
        })
      }

      recursive(collection)
      return expandedKeys
    },
    filterTreeNode (node = {}) {
      // 使用了 replaceFields
      const title = (node.title || node.alias || '').trim().toLowerCase()
      const searchValue = (this.searchValue || '').trim().toLowerCase()
      if (searchValue) {
        return title.includes(searchValue)
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
