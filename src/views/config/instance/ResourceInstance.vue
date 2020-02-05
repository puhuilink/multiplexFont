<template>
  <div class="ResourceInstance">
    <a-row type="flex">

      <!-- / tree -->
      <a-col :xl="6" :xxl="4">
        <ResourceTree
          class="ResourceInstance-tree"
          instanceListCount
          @select="select"
        />
      </a-col>

      <!-- / content -->
      <a-col :xl="18" :xxl="20">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="实例列表" key="1" forceRender>
            <ResourceInstanceList
              v-if="selectedNode"
              class="ResourceInstance-table"
              :where="{
                parentname_s: {
                  _eq: selectedNode.name_s
                }
              }"
            />
          </a-tab-pane>
          <a-tab-pane tab="操作日志" key="2" forceRender>
            <OperationLogList
              v-if="selectedNode"
              class="ResourceInstance-table"
              :where="{
                modelname_s: {
                  _eq: selectedNode.name_s
                },
                operationtype_s: {
                  _eq: 'instance'
                }
              }"
            />
          </a-tab-pane>
          <a-tab-pane tab="版本" key="3" forceRender>
            <ResourceInstanceVersionList
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
  ResourceInstanceList,
  ResourceInstanceVersionList
} from '@/components/Resource'
import { OperationLogList } from '@/components/Operation'

export default {
  name: 'ResourceInstance',
  components: {
    ResourceTree,
    ResourceInstanceList,
    OperationLogList,
    ResourceInstanceVersionList
  },
  data: () => ({
    selectedNode: null
  }),
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
.ResourceInstance {
  height: 100%;

  &-tree {
    margin-right: 8px;
    height: calc(100vh - 270px);
    overflow-y: auto;
  }

  &-table {
    margin-right: 8px;
    // height: calc(100vh - 270px);
    overflow-y: auto;
  }
}
</style>
