<template>
  <div class="ResourceTree">
    <a-input-search
      allowClear
      autoFocus
      style="padding: 8px;"
      placeholder="搜索资源树"
      :value="searchValue"
      @change="search"
    />
    <!-- FIXME: loading 非响应式 -->
    <!-- v-if="$apollo.queries.dataSource.loading" -->
    <a-spin
      v-if="loading"
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
// import gql from 'graphql-tag'
import { buildTree, search } from './utils'
import Resource from '@/graphql/service/Resource'

export default {
  name: 'ResourceTree',
  // apollo: {
  //   dataSource: {
  //     query: gql`query ($instanceListCount: Boolean!) {
  //       ngecc_model {
  //         title: label_s
  //         key: name_s
  //         parentKey: parentname_s
  //         instanceList: instanceList_aggregate @include(if: $instanceListCount) {
  //           aggregate {
  //             count
  //           }
  //         }
  //       }
  //     }`,
  //     update (data) {
  //       this.autoExpandParent = true
  //       return data.ngecc_model
  //     },
  //     variables () {
  //       return {
  //         instanceListCount: this.instanceListCount
  //       }
  //     }
  //   }
  // },
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
  watch: {
    instanceListCount: {
      immediate: true,
      handler: 'fetch'
    }
  },
  methods: {
    async fetch () {
      try {
        this.loading = true
        const { data } = await Resource.query()
        this.dataSource = data.ngecc_model
      } catch (e) {
        this.dataSource = []
        throw e
      } finally {
        this.loading = false
        this.autoExpandParent = true
      }
    },
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
