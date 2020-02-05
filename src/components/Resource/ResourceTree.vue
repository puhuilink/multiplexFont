<template>
  <div class="ResourceTree">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="资源树" key="1">
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
          :selectedKeys="[selectedKey]"
          :treeData="treeData"
          @expand="expand"
          @select="select"
        />

        <ResourceTreeNodeSchema
          ref="schema"
        />

      </a-tab-pane>

      <template slot="tabBarExtraContent">
        <div class="ResourceTree__tabBarExtraContent">
          <a-button icon="upload"></a-button>
          <a-button icon="download"></a-button>
          <template v-if="!instanceListCount">
            <a-button icon="folder-add" :disabled="disabled" @click="add"></a-button>
            <a-button icon="edit" :disabled="disabled"></a-button>
            <a-button icon="delete" :disabled="disabled"></a-button>
          </template>
        </div>
      </template>
    </a-tabs>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { buildTree, search } from './utils'
import ResourceTreeNodeSchema from './ResourceTreeNodeSchema'
import Template from '../../views/design/moduels/template/index'

export default {
  name: 'ResourceTree',
  apollo: {
    // FIXME: instanceList 应当也包含子代的 children
    // TODO: subscribe 节点增加 / 删除
    dataSource: {
      query: gql`query ($instanceListCount: Boolean!) {
        dataSource: ngecc_model {
          did
          label_s
          name_s
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
  components: {
    Template,
    ResourceTreeNodeSchema
  },
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
    disabled: {
      get () {
        return !this.selectedKey
      }
    },
    treeData: {
      get () {
        return buildTree(this.dataSource)
      }
    }
  },
  methods: {
    add () {
      this.$refs['schema'].add()
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
     * 选中/取消选中树节点触发
     * @event
     * @return {Undefined}
     */
    select ([selectedKey], { selected, selectedNodes: [selectedNode] }) {
      if (selected) {
        this.selectedKey = selectedKey
        const dataRef = selectedNode.data.props.dataRef
        this.$emit('select', {
          'did': dataRef.did,
          'label_s': dataRef.label_s,
          'name_s': dataRef.name_s
        })
      } else {
        this.selectedKey = ''
        this.$emit('select', null)
      }
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
.ResourceTree {
  &__tabBarExtraContent {
    padding-right: 8px;
  }

  .ant-btn {
    padding: 0 2.5px !important;
    border: none !important;
    background-color: transparent !important;
    transform: translateY(3px);
  }
}
</style>
