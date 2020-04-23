<template>
  <div class="ResourceTree" :class="{ 'ResourceTree__hidden-tab': hiddenTab }">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="资源树" key="1">
        <!-- TODO: 固定搜索栏 -->
        <a-input-search
          allowClear
          autoFocus
          style="padding: 8px;"
          placeholder="搜索资源树"
          :value="searchValue"
          @change="change"
        />
        <a-spin
          v-if="$apollo.queries.dataSource.loading"
          spinning
        />
        <a-tree
          v-else
          :autoExpandParent="autoExpandParent"
          class="ResourceTree__tree"
          :style="{
            height: this.hiddenTab ? 'calc(100vh - 150px)' : 'calc(100vh - 175px)'
          }"
          defaultExpandAll
          :expandedKeys="expandedKeys"
          :filterTreeNode="filterNode"
          :selectedKeys="[selectedKey]"
          :treeData="treeData"
          @expand="expand"
          @select="select"
        />

        <ResourceTreeNodeSchema
          ref="schema"
          @addSuccess="addSuccess"
          @editSuccess="editSuccess"
        />

      </a-tab-pane>

      <template slot="tabBarExtraContent">
        <div class="ResourceTree__tabBarExtraContent">
          <a-button icon="upload"></a-button>
          <a-button icon="download"></a-button>
          <template v-if="!instanceList">
            <a-button icon="folder-add" :disabled="disabled" @click="add"></a-button>
            <a-button icon="edit" :disabled="disabled" @click="edit"></a-button>
            <a-button @click="onDelete" icon="delete" :disabled="disabled"></a-button>
          </template>
        </div>
      </template>
    </a-tabs>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { buildTree, search, flatChildrenNodeNameListAndDidList } from './utils'
import ResourceTreeNodeSchema from './ResourceTreeNodeSchema'
import Template from '../../views/design/modules/template/index'
import deleteCheck from '@/components/DeleteCheck'
import { deleteModelList } from '@/api/controller/Resource'
import _ from 'lodash'

export default {
  name: 'ResourceTree',
  apollo: {
    // TODO: 在 hasura 层通过 RelationShips 直接构造好树结构
    // TODO: subscribe 节点增加 / 删除
    // TODO: 排序
    // TODO: 默认展开层级
    dataSource: {
      query: gql`query ($instanceList: Boolean!) {
        dataSource: ngecc_model {
          did
          label_s
          name_s
          batch_b
          edit_b
          encrypt_s
          order_i
          icon_s
          parenttree_s
          _id_s
          title: label_s
          key: name_s
          parentKey: parentname_s
          parentname_s: parentname_s
          instanceList @include(if: $instanceList) {
            did
            _id_s
            name_s
            title: label_s
            key: name_s
            parentKey: parentname_s
            parentname_s: parentname_s
          }
        }
      }`,
      result () {
        this.autoExpandParent = true
      },
      // 响应式，当数据变化时，触发刷新
      variables () {
        return {
          instanceList: this.instanceList
        }
      }
    }
  },
  components: {
    Template,
    ResourceTreeNodeSchema
  },
  props: {
    // 隐藏分页
    hiddenTab: {
      type: Boolean,
      default: false
    },
    // 统计节点下的实例列表数量
    instanceList: {
      type: Boolean,
      default: false
    },
    // 根节点
    rootKeys: {
      type: Array,
      default: () => (['Ci'])
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
    selectedNode: {
      get () {
        if (!this.selectedKey) {
          return null
        } else {
          const value = this.dataSource.find(el => el.key === this.selectedKey)
          return value
        }
      }
    },
    treeData: {
      get () {
        return buildTree(this.dataSource, this.rootKeys)
      }
    }
  },
  methods: {
    add () {
      // eslint-disable-next-line
      const { parenttree_s, name_s } = this.selectedNode
      // 父节点位置加上自身的名字，就是自身节点的位置
      this.$refs['schema'].add(
        name_s,
        // eslint-disable-next-line
        `${parenttree_s}${name_s}`
      )
    },
    addSuccess () {
      this.$apollo.queries.dataSource.refetch()
    },
    edit () {
      this.$refs['schema'].edit({ ...this.selectedNode })
    },
    editSuccess () {
      this.$apollo.queries.dataSource.refetch()
    },
    filterNode ({ title = '' }) {
      const { searchValue = '' } = this
      // FIXME: 数据库存在空数据
      return searchValue && (title || '').toLowerCase().includes(searchValue.toLowerCase())
    },
    async onDelete () {
      if (!await deleteCheck.sureDelete()) {
        return
      }
      // 删除一个节点，其子节点都要删除，并且子节点相关联的表也应处理
      try {
        // TODO: 删除接口
        // 删除成功重置
        const [nameList, didList] = flatChildrenNodeNameListAndDidList(this.selectedNode)
        console.log(nameList, didList)
        await deleteModelList(nameList, didList)
        await this.$apollo.queries.dataSource.refetch()
        this.selectedKey = ''
      } catch (e) {
        throw e
      } finally {
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
          'name_s': dataRef.name_s,
          'name': dataRef.name_s,
          'tree_s': dataRef.parenttree_s + dataRef.name_s,
          'parentname_s': dataRef.parentname_s,
          'parentname': dataRef.parentname_s,
          '_id_s': dataRef._id_s
        })
      } else {
        // FIXME: 新增后可以不用重置
        // this.selectedNode = null
        this.selectedKey = ''
        this.$emit('select', null)
      }
    },
    search: _.debounce(function (value) {
      this.expandedKeys = search(value, this.dataSource)
      this.autoExpandParent = true
    }, 300),
    /**
     * 查询树节点输入
     * @event
     * @return {Undefined}
     */
    change: function ({ target: { value } }) {
      this.searchValue = value
      if (!value) {
        return
      }
      this.search(value)
    }
  }
}
</script>

<style lang="less">
.ResourceTree {
  &__tree {
    overflow: auto;
  }
  &__hidden-tab {
    .ant-tabs-bar {
      display: none;
    }
  }
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
