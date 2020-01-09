<template>
  <div class="resource-instance">
    <a-row type="flex">
      <!-- / tree -->
      <a-col :xs="6">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="资源树" key="1">
            <a-tree class="tree" v-if="treeData.length" :treeData="treeData" defaultExpandAll @select="select" />
          </a-tab-pane>
        </a-tabs>
      </a-col>

      <!-- / content -->
      <a-col :xs="18">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="实例列表" key="1" forceRender>
            <InstanceTable :parentnameS="selectedKey" />
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
import { buildTree } from '../utils'
import InstanceTable from './InstanceTable'

export default {
  name: 'ResourceInstance',
  apollo: {
    treeData: {
      query: gql`query MyQuery {
        ngecc_model {
          title: label_s
          key: name_s
          parentKey: parentname_s
        }
      }`,
      update: data => buildTree(data.ngecc_model)
    }
  },
  components: {
    InstanceTable
  },
  data: () => ({
    treeData: [],
    selectedKey: ''
  }),
  methods: {
    /**
     * 点击树节点触发
     * @event
     * @return {Undefined}
     */
    select ([selectedKey], { selected }) {
      this.selectedKey = selected ? selectedKey : ''
    }
  }
}
</script>

<style>
.full-height {
  height: 100%;
}
.resource-instance {
  height: 100%;
}
.tree {
  height: calc(100vh - 120px);
  overflow-y: auto;
}
</style>
