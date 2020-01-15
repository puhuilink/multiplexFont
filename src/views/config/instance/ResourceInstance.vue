<template>
  <div class="resource-instance">
    <a-row type="flex">

      <!-- / tree -->
      <a-col :xl="6" :xxl="4">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="资源树" key="1">
            <ResourceTree
              class="resource-instance-tree"
              instanceListCount
              @select="select"
            />
          </a-tab-pane>
        </a-tabs>
      </a-col>

      <!-- / content -->
      <a-col :xl="18" :xxl="20">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="实例列表" key="1" forceRender>
            <ResourceInstanceList
              v-if="selectedKey"
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
import ResourceTree from '@/components/Resource/ResourceTree'
import ResourceInstanceList from '@/components/Resource/Instance/ResourceInstanceList'

export default {
  name: 'ResourceInstance',
  components: {
    ResourceTree,
    ResourceInstanceList
  },
  data: () => ({
    selectedKey: ''
  }),
  methods: {
    /**
     * 资源树选中/取消选中节点
     * @param {String} selectedKey 选中节点的 key
     * @return {Undefined}
     */
    select (selectedKey) {
      this.selectedKey = selectedKey
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
