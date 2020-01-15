<template>
  <div class="ResourceTree">
    <!-- TODO: 固定搜索栏 -->
    <a-input-search
      allowClear
      autoFocus
      style="padding: 8px;"
      placeholder="搜索资源树"
      :value="searchValue"
      @change="search"
    />
    <a-spin
      v-if="$apollo.queries.dataSource.loading"
      spinning
    />
    <a-tree
      v-else
      :autoExpandParent="autoExpandParent"
      defaultExpandAll
      :expandedKeys="expandedKeys"
      :filterTreeNode="node => searchValue && node.title.toLowerCase().includes(searchValue.toLowerCase())"
      :treeData="treeData"
      @expand="expand"
      @select="select"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { buildTree, search } from './utils'

export default {
  name: 'ResourceTree',
  apollo: {
    // FIXME: instanceList 应当也包含子代的 children
    // TODO: subscribe 节点增加 / 删除
    dataSource: {
      query: gql`query ($instanceListCount: Boolean!) {
        dataSource: ngecc_model {
          title: label_s
          key: name_s
          parentKey: parentname_s
          instanceList: instanceList_aggregate @include(if: $instanceListCount) {
            aggregate {
              count
            }
          }
        }
      }`,
      result () {
        this.autoExpandParent = true
      },
      variables () {
        return {
          instanceListCount: this.instanceListCount
        }
      }
    }
  },
  components: {},
  props: {
    // 统计节点下的实例列表数量
    instanceListCount: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dataSource: [],
    loading: false,
    selectedKey: '',
    autoExpandParent: true,
    expandedKeys: [],
    searchValue: ''
  }),
  computed: {
    treeData: {
      get () {
        return buildTree(this.dataSource)
      }
    }
  },
  methods: {
    /**
     * 展开树节点触发
     * @param {Array<String>} expandedKeys 展开的树节点
     * @return {Undefined}
     */
    expand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    /**
     * 点击树节点触发
     * @event
     * @return {Undefined}
     */
    select ([selectedKey], { selected }) {
      this.selectedKey = selected ? selectedKey : ''
      this.$emit('select', this.selectedKey)
    },
    /**
     * 查询树节点输入
     * @event
     * @return {Undefined}
     */
    search ({ target: { value } }) {
      this.searchValue = value
      this.expandedKeys = search(value, this.dataSource)
    }
  }
}
</script>

<style lang="less">

</style>
