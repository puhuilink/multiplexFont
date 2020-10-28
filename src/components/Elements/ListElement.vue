<template>
  <div class="list-element">

    <!-- S 列表 -->
    <a-table
      rowKey="uuid"
      ref="table"
      :columns="columns"
      :dataSource="dataSource"
      :scroll="scroll"
      :pagination="false"
      :customHeaderRow="() => ({ style: headerRowStyle })"
      :customRow="customRow"
    >
    </a-table>
    <!-- E 列表 -->
  </div>
</template>

<script>
import ListMixin from '@/components/Elements/ListMixin'

export default {
  name: 'ListElement',
  mixins: [ListMixin]
}
</script>

<style lang="less">
</style>
