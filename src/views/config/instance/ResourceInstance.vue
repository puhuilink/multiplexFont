<template>
  <div class="resource-instance">
    <a-row type="flex">

      <!-- / tree -->
      <a-col :xl="6">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="资源树" key="1">
            <a-input-search
              allowClear
              autoFocus
              style="padding: 8px;"
              placeholder="搜索资源树"
              :value="searchValue"
              @change="search"
            />
            <a-spin
              v-if="!treeData.length"
              spinning
            />
            <a-tree
              v-else
              class="resource-instance-tree"
              autoExpandParent
              defaultExpandAll
              :expandedKeys="expandedKeys"
              :filterTreeNode="node => searchValue && node.title.toLowerCase().includes(searchValue.toLowerCase())"
              :treeData="treeData"
              @expand="expand"
              @select="select"
            />
          </a-tab-pane>
        </a-tabs>
      </a-col>

      <!-- / content -->
      <a-col :xl="18">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="实例列表" key="1" forceRender>
            <InstanceTable
              v-show="selectedKey"
              class="resource-instance-table"
              :parentnameS="selectedKey"
            />
          </a-tab-pane>
          <a-tab-pane tab="操作日志" key="2" forceRender>操作日志</a-tab-pane>
          <a-tab-pane tab="版本" key="3" forceRender>版本</a-tab-pane>
        </a-tabs>
      </a-col>

    </a-row>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { buildTree, search } from '../utils'
import InstanceTable from './InstanceTable'

export default {
  name: 'ResourceInstance',
  apollo: {
    dataSource: {
      query: gql`query MyQuery {
        ngecc_model {
          title: label_s
          key: name_s
          parentKey: parentname_s
        }
      }`,
      update: data => data.ngecc_model
    }
  },
  components: {
    InstanceTable
  },
  data: () => ({
    dataSource: [],
    selectedKey: '',
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
    },
    /**
     * 点击树节点触发
     * @event
     * @return {Undefined}
     */
    select ([selectedKey], { selected }) {
      this.selectedKey = selected ? selectedKey : ''
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
.resource-instance {
  height: 100%;

  &-tree {
    margin-right: 8px;
    height: calc(100vh - 270px);
    overflow-y: auto;
  }

  &-table {
    margin-right: 8px;
    height: calc(100vh - 270px);
    overflow-y: auto;
  }
}
</style>
