<template>
  <div class="list-element">

    <!-- S 列表 -->
    <a-table
      :customHeaderRow="() => ({ style: headerRowStyle })"
      :customRow="customRow"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      rowKey="uuid"
      ref="table"
      :scroll="scroll"
    >
    </a-table>
    <!-- E 列表 -->
  </div>
</template>

<script>

import NewAlarmMixin from '~~~/Elements/NewAlarmMixin'

export default {
  name: 'NewAlarmElement',
  mixins: [NewAlarmMixin]
}
</script>

<style lang="less">
.list-element {
  .ant-table-placeholder {
    display: none;
  }
}
</style>
