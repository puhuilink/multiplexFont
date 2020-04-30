<template>
  <div class="ResourceTree" :class="{ 'ResourceTree__hidden-tab': hiddenTab }">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="资源树" key="1">
        <a-input-search
          allowClear
          autoFocus
          style="padding: 8px;"
          placeholder="搜索资源树"
          :value="searchValue"
          @change="change"
        />
        <a-spin
          v-if="loading"
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
          :draggable="draggable"
          :expandedKeys="expandedKeys"
          :filterTreeNode="filterNode"
          :selectedKeys="[selectedKey]"
          :treeData="treeData"
          v-on="$listeners"
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
          <template v-if="!onlyExcelOption">
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
import { buildTree, search, flatChildrenNodeNameListAndDidList } from './utils'
import ResourceTreeNodeSchema from './ResourceTreeNodeSchema'
import Template from '../../views/design/modules/template/index'
import deleteCheck from '@/components/DeleteCheck'
import _ from 'lodash'
import { ModelService } from '@/api-hasura'

export default {
  name: 'ResourceTree',
  components: {
    Template,
    ResourceTreeNodeSchema
  },
  props: {
    draggable: {
      type: Boolean,
      default: false
    },
    // 隐藏分页
    hiddenTab: {
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
    // TODO: instanceListCount
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
    async fetch () {
      try {
        this.loading = true
        const { data: { dataSource } } = await ModelService.find({
          fields: [
            '_id',
            'name',
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
            }`
          ],
          alias: 'dataSource'
        }, this.instanceList)
        this.dataSource = dataSource
      } catch (e) {
        this.dataSource = []
        throw e
      } finally {
        this.autoExpandParent = true
        this.loading = false
      }
    },
    add () {
      const { parentTree, name } = this.selectedNode
      // 父节点位置加上自身的名字，就是自身节点的位置
      this.$refs['schema'].add(
        name,
        // eslint-disable-next-line
        `${parentTree}${name}`
      )
    },
    addSuccess () {
      this.fetch()
    },
    edit () {
      this.$refs['schema'].edit({ ...this.selectedNode })
    },
    editSuccess () {
      this.fetch()
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
        const [nameList, _idList] = flatChildrenNodeNameListAndDidList(this.selectedNode)
        console.log(nameList, _idList)
        // await deleteModelList(nameList, _idList)
        await ModelService.delete(nameList)
        await this.fetch()
        this.selectedKey = ''
        this.$notification.success({
          message: '系统提示',
          description: '删除成功'
        })
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
        this.$emit('selectNode', {
          'did': dataRef.did,
          'label_s': dataRef.label_s,
          'name': dataRef.name,
          'name_s': dataRef.name,
          'tree_s': dataRef.parentTree + dataRef.name,
          'parentname_s': dataRef.parentname_s,
          'parentName': dataRef.parentname_s,
          '_id_s': dataRef._id_s
        })
      } else {
        // FIXME: 新增后可以不用重置
        // this.selectedNode = null
        this.selectedKey = ''
        this.$emit('selectNode', null)
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
  },
  async created () {
    await this.fetch()
    await this.$nextTick()
    // 默认展开根节点
    // TODO: 支持 props 指定默认展开层级
    this.expandedKeys = [ ...this.rootKeys ]
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
