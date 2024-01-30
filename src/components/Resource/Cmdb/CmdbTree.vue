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
        :replaceFields="{
          children: 'children',
          title: 'alias',
          key:'id'
        }"
        showLine
        :treeData="treeData"
        v-on="$listeners"
        v-bind="$props"
      >
        <template v-slot:title="{ alias: title }">
          <span v-if="filterTreeNode({ title })">
            <span>{{ title.substring(0, title.toLowerCase().indexOf(searchValue.toLowerCase())) }}</span>
            <span style="color: #37b3a4">{{ searchValue }}</span>
            <a-popover>
              <template slot="content">
                <span>{{ title.substring(title.toLowerCase().indexOf(searchValue.toLowerCase()) + searchValue.length) }}</span>
              </template>
            </a-popover>
          </span>
          <span v-else>
            <a-popover placement="right">
              <template slot="content">
                <span>{{ title }}</span>
              </template>
              <span>{{ title }}</span>
            </a-popover>
          </span>
        </template>
      </a-tree>
    </a-spin>
  </div>
</template>

<script>
import { CmdbService } from '@/api'

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
    searchValue: '',
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
    /**
     * 判断节点是否符合搜索条件
     */
    filterTreeNode ({ title = '' }) {
      const t = title.trim().toLowerCase()
      const s = (this.searchValue || '').trim().toLowerCase()

      if (t && s) {
        return t.includes(s)
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
  border: 1px solid rgba(191, 191, 191, 1);
  border-radius: 5px;
  padding: 5px;
  height: 720px;
  overflow: scroll;
  &__search {
    position: sticky;
    top: 0px;
    background: #fff;
    z-index: 1;
  }
}
</style>
