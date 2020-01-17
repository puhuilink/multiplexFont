<template>
  <div class="ResourceModel">
    <a-row type="flex">

      <!-- / tree -->
      <a-col :xl="6" :xxl="4">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="资源树" key="1">
            <ResourceTree
              class="ResourceInstance-tree"
              instanceListCount
              @select="select"
            />
          </a-tab-pane>
        </a-tabs>
      </a-col>

      <!-- / content -->
      <a-col :xl="18" :xxl="20">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="属性列表" key="1" forceRender>
            <ResourceModelAttrList
              v-if="selectedNode"
              class="ResourceInstance-table"
              operationType="model"
              :where="{ did: {
                _eq: selectedNode.did
              } }"
            />
          </a-tab-pane>
          <a-tab-pane tab="关系属性" key="2" forceRender>
            <ResourceModelRelationAttrList
              v-if="selectedNode"
              class="ResourceInstance-table"
              :where="{ source_s: {
                _eq: selectedNode.name_s
              } }"
            />
          </a-tab-pane>
          <a-tab-pane tab="操作日志" key="3" forceRender>
            <OperationLogList
              v-if="selectedNode"
              class="ResourceInstance-table"
              :where="{
                modelname_s: {
                  _eq: selectedNode.name_s
                },
                operationtype_s: {
                  _eq: 'model'
                }
              }"
            />
          </a-tab-pane>

          <a-tab-pane tab="版本" key="4" forceRender>
            <ResourceModelVersionList
              v-if="selectedNode"
              class="ResourceInstance-table"
              :where="{
                parentname_s: {
                  _eq: selectedNode.name_s
                }
              }"
            />
          </a-tab-pane>
        </a-tabs>
      </a-col>

    </a-row>
  </div>
</template>

<script>
import {
  ResourceTree,
  ResourceModelAttrList,
  ResourceModelRelationAttrList,
  ResourceModelVersionList
} from '@/components/Resource'
import { OperationLogList } from '@/components/Operation'

export default {
  name: 'ResourceModel',
  components: {
    ResourceTree,
    OperationLogList,
    ResourceModelAttrList,
    ResourceModelRelationAttrList,
    ResourceModelVersionList
  },
  props: {},
  data: () => ({
    selectedNode: null,
    selectedKey: '',
    did: ''
  }),
  computed: {},
  methods: {
    /**
     * 资源树选中/取消选中节点
     * @param {Object | Null} selectedNode 选中节点的数据
     * @return {Undefined}
     */
    select (selectedNode) {
      this.selectedNode = selectedNode
    }
  }
}
</script>

<style lang="less">
.ResourceModel {
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
