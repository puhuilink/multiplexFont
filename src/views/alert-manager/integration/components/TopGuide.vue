<template>
  <div
    style="display: flex;  align-items: center;justify-content: space-between">
    <a-tabs default-active-key="1" style="margin-left: 15px">
      <a-tab-pane key="1" tab="    监控工具   "></a-tab-pane>
    </a-tabs>
    <a-select style="width: 200px;margin-right: 15px"> </a-select>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TopGuide'
  // TODO 添加props与父组件交互
  // TODO 将style样式全写在下边 以class的形式
}
</script>

<style scoped></style>
