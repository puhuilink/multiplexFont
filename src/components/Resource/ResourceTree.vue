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
          :style="{ height: treeHeight }"
          defaultExpandAll
          :draggable="draggable"
          :expandedKeys="expandedKeys"
          :filterTreeNode="filterNode"
          showIcon
          showLine
          :selectedKeys="[selectedKey]"
          :treeData="treeData"
          v-on="$listeners"
          @expand="onExpand"
          @select="onSelect"
        >
          <template v-slot:custom="{ dataRef: { icon } }">
            <img :src="resolveIcon(icon)" class="ResourceTree__tree_icon" />
          </template>
        </a-tree>

        <ResourceTreeNodeSchema
          ref="schema"
          @addSuccess="fetch"
          @editSuccess="fetch"
        />

      </a-tab-pane>

      <!-- / operation -->
      <div slot="tabBarExtraContent" class="ResourceTree__tabBarExtraContent">
        <a-tooltip title="导入 Excel">
          <a-button icon="upload" />
        </a-tooltip>
        <a-tooltip title="导出 Excel">
          <a-button icon="download" />
        </a-tooltip>
        <template v-if="!onlyExcelOption">
          <a-tooltip title="新增模型节点">
            <a-button icon="folder-add" :disabled="disabled" @click="onAdd" />
          </a-tooltip>
          <a-tooltip title="编辑模型节点">
            <a-button icon="edit" :disabled="disabled" @click="onEdit" />
          </a-tooltip>
          <a-tooltip title="删除模型节点">
            <a-button @click="onDelete" icon="delete" :disabled="disabled" />
          </a-tooltip>
        </template>
      </div>
    </a-tabs>
  </div>
</template>

<script>
import { buildTree, search, flatChildrenNodeNameListAndDidList } from './utils'
import ResourceTreeNodeSchema from './ResourceTreeNodeSchema'
import Template from '../../views/design/modules/template/index'
import deleteCheck from '@/components/DeleteCheck'
import _ from 'lodash'
import { ModelService } from '@/api-hasura'
import OperationNotification from '@/components/Mixins/OperationNotification'

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
    readOnly: {
      type: Boolean,
      default: false
    },
    // 只展示导入、导出 excel的按钮
    onlyExcelOption: {
      type: Boolean,
      default: false
    },
    // 将其实例也构建到树中
    instanceList: {
      type: Boolean,
      default: false
    },
    rootKeys: {
      type: Array,
      default: () => (['Ci'])
    }
  },
  data: () => ({
    dataSource: [],
    loading: false,
    selectedNode: null,
    autoExpandParent: true,
    expandedKeys: [],
    searchValue: ''
  }),
  computed: {
    disabled () {
      return !this.selectedKey
    },
    selectedKey () {
      const { selectedNode } = this
      return selectedNode ? selectedNode.key : ''
    },
    treeData () {
      return buildTree(this.dataSource, this.rootKeys)
    },
    treeHeight () {
      const { readOnly } = this
      const height = readOnly ? 'calc(100vh - 150px)' : 'calc(100vh - 175px)'
      return `max(${height}, 300px)`
    }
  },
  watch: {
    selectedNode (node) {
      if (node) {
        const { _id, label, name, parentName, parentTree } = node
        const option = { _id, label, name, parentName, parentTree, tree: parentTree + name }
        this.$emit('selectNode', option)
      } else {
        this.$emit('selectNode', null)
      }
    }
  },
  methods: {
    async fetch () {
      try {
        this.loading = true
        const { data: { dataSource } } = await ModelService.find({
          fields: [
            '_id',
            'name',
            'icon: icon',
            'key: name',
            'label',
            'title: label',
            'parentName',
            'parentKey: parentName',
            'parentTree',
            'order',
            !this.instanceList ? `` : `instanceList {
              _id
              name
              key: name
              label
              title: label
              parentName
              parentKey: parentName
              parentTree
              icon: values(path: "$.icon")
            }`
          ],
          alias: 'dataSource'
        })
        this.dataSource = dataSource
      } catch (e) {
        this.dataSource = []
        throw e
      } finally {
        this.autoExpandParent = true
        this.loading = false
      }
    },
    filterNode (node = {}) {
      const { searchValue = '' } = this
      const { title = '' } = node
      return searchValue && (title || '').toLowerCase().includes(searchValue.toLowerCase())
    },
    /**
     * 新增模型节点
     * @event
     */
    onAdd () {
      const { parentTree, name } = this.selectedNode
      // 父节点位置加上自身的名字，就是自身节点的位置
      this.$refs['schema'].add(
        name,
        // eslint-disable-next-line
        `${parentTree}${name}`
      )
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
        const [nameList] = flatChildrenNodeNameListAndDidList(this.selectedNode)
        await ModelService.batchDelete(nameList)
        this.notifyDeleteSuccess()
        this.selectedNode = null
        await this.fetch()
      } catch (e) {
        this.notifyError(e)
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
      this.autoExpandParent = true
      this.selectedNode = selected ? selectedNode.data.props.dataRef : null
    },
    /**
     * 查询框输入
     * @event
     */
    onSearchValueChange ({ target: { value } }) {
      this.searchValue = value.trim()
      if (this.searchValue) {
        this.search(this.searchValue)
      }
    },
    /**
     * 加载节点 icon
     */
    resolveIcon (icon) {
      try {
        return require(`@/assets/network-icons/${icon}.png`)
      } catch (e) {
        return require(`@/assets/network-icons/Others.png`)
      }
    },
    /**
     * 查询匹配数据
     */
    search: _.debounce(function (value) {
      this.expandedKeys = search(value, this.dataSource)
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
