<template>
  <div class="ResourceTree" :class="{ 'ResourceTree__read-only': readOnly }">
    <a-tabs defaultActiveKey="1">

      <!-- / tree -->
      <a-tab-pane tab="资源树" key="1">
        <a-input-search
          allowClear
          autoFocus
          style="padding: 8px;"
          placeholder="搜索资源树"
          :value="searchValue"
          @change="onSearchValueChange"
        />
        <a-spin
          v-if="loading"
          spinning
        />
        <a-tree
          v-else
          :autoExpandParent="autoExpandParent"
          class="ResourceTree__tree"
          defaultExpandAll
          :draggable="draggable"
          :expandedKeys="expandedKeys"
          :filterTreeNode="filterTreeNode"
          :replaceFields="{ title:'label', key:'name' }"
          :selectedKeys="[selectedKey]"
          showIcon
          showLine
          :style="{ height: treeHeight }"
          :treeData="treeData"
          v-on="$listeners"
          @expand="onExpand"
          @select="onSelect"
        >
          <template v-slot:custom="{ dataRef: { icon } }">
            <img :src="resolveIcon(icon)" class="ResourceTree__tree_icon" />
          </template>
        </a-tree>

      </a-tab-pane>

      <!-- / operation -->
      <div slot="tabBarExtraContent" class="ResourceTree__tabBarExtraContent">

        <a-tooltip title="导入 Excel">
          <a-button icon="upload" />
        </a-tooltip>

        <a-tooltip title="导出 Excel">
          <a-button icon="download" />
        </a-tooltip>

        <template v-if="!onlyExcelOperation">

          <a-tooltip title="新增模型节点">
            <a-button icon="folder-add" :disabled="disabled" @click="onAdd" />
          </a-tooltip>

          <a-tooltip title="编辑模型节点">
            <a-button icon="edit" :disabled="disabled" @click="onEdit" />
          </a-tooltip>

          <a-tooltip title="删除模型节点">
            <a-button icon="delete" :disabled="disabled" @click="onDelete" />
          </a-tooltip>

        </template>
      </div>
    </a-tabs>

    <ResourceTreeNodeSchema
      ref="schema"
      @addSuccess="fetch"
      @editSuccess="fetch"
    />
  </div>
</template>

<script>
import { buildTree, search, flatChildrenNameList } from './utils'
import ResourceTreeNodeSchema from './ResourceTreeNodeSchema'
import Template from '../../views/design/modules/template/index'
import deleteCheck from '@/components/DeleteCheck'
import _ from 'lodash'
import { ModelService } from '@/api-hasura'
import OperationNotification from '@/components/Mixins/OperationNotification'
import defaultIcon from '@/assets/network-icons/Others.png'

export default {
  name: 'ResourceTree',
  mixins: [OperationNotification],
  components: {
    Template,
    ResourceTreeNodeSchema
  },
  props: {
    draggable: {
      type: Boolean,
      default: false
    },
    onlyExcelOperation: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    rootKeys: {
      type: Array,
      default: () => (['Ci']),
      validator: v => !_.isEmpty(v)
    },
    withInstance: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    autoExpandParent: true,
    expandedKeys: [],
    flatTreeData: [],
    loading: false,
    selectedNode: null,
    searchValue: ''
  }),
  computed: {
    disabled () {
      return !this.selectedNode
    },
    selectedKey () {
      const { selectedNode } = this
      return selectedNode ? selectedNode.name : ''
    },
    treeData () {
      return buildTree(this.flatTreeData, this.rootKeys)
    },
    treeHeight () {
      const height = this.readOnly ? 'calc(100vh - 150px)' : 'calc(100vh - 175px)'
      return `max(${height}, 300px)`
    }
  },
  watch: {
    selectedNode (node) {
      if (node) {
        const { _id, label, name, parentName, parentTree, tree } = node
        this.$emit('selectNode', { _id, label, name, parentName, parentTree, tree })
      } else {
        this.$emit('selectNode', null)
      }
    }
  },
  methods: {
    async fetch () {
      try {
        this.loading = true
        this.flatTreeData = await ModelService.flatTree(this.rootKeys, this.withInstance)
      } catch (e) {
        this.flatTreeData = []
        throw e
      } finally {
        this.autoExpandParent = true
        this.loading = false
      }
    },
    filterTreeNode (node = {}) {
      const { searchValue = '' } = this
      const { title = '' } = node
      return searchValue && (title || '').toLowerCase().includes(searchValue.toLowerCase())
    },
    /**
     * 新增模型节点
     * @event
     */
    onAdd () {
      const { name, tree } = this.selectedNode
      this.$refs['schema'].add(name, tree)
    },
    /**
     * 删除模型节点
     * @event
     */
    async onDelete () {
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        const nameList = flatChildrenNameList(this.selectedNode)
        await ModelService.batchDelete(nameList)
        this.$notifyDeleteSuccess()
        this.selectedNode = null
        await this.fetch()
      } catch (e) {
        this.$notifyError(e)
        throw e
      } finally {
      }
    },
    /**
     * 编辑模型节点
     * @event
     */
    onEdit () {
      this.$refs['schema'].edit({ ...this.selectedNode })
    },
    /**
     * 展开树节点
     * @event
     */
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    /**
     * 选中/取消选中树节点
     * @event
     */
    onSelect ([selectedKey], { selected, selectedNodes: [selectedNode] }) {
      if (selected) {
        const { dataRef } = selectedNode.data.props
        const { parentTree, name } = dataRef
        this.selectedNode = {
          ...dataRef,
          tree: `${parentTree}${name}`
        }
      } else {
        this.selectedNode = null
      }
    },
    /**
     * 查询框输入
     * @event
     */
    onSearchValueChange ({ target: { value } }) {
      this.searchValue = value.trim()
      this.searchValue && this.search(this.searchValue)
    },
    /**
     * 加载节点 icon
     */
    resolveIcon (icon) {
      try {
        return require(`@/assets/network-icons/${icon}.png`)
      } catch (e) {
        return defaultIcon
      }
    },
    /**
     * 查询匹配数据
     */
    search: _.debounce(function (value) {
      this.expandedKeys = search(value, this.flatTreeData)
      this.autoExpandParent = true
    }, 300)
  },
  created () {
    this.expandedKeys = [ ...this.rootKeys ]
    this.fetch()
  }
}
</script>

<style lang="less">
.ResourceTree {
  overflow: auto;

  &__tree {
    overflow: auto;

    // icon slot antd 默认控制了宽高
    &_icon {
      display: inline-block;
      width: 100%;
      height: 100%;
      padding: 3px;
      vertical-align: super;
    }
  }

  &__read-only {
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
