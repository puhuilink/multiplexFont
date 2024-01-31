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
      :locale="locale"
      :scroll="scroll"
    >
    </a-table>
    <!-- E 列表 -->
  </div>
</template>

<script>
import ListMixin from '@/components/Elements/ListMixin'

export default {
  name: 'ListElement',
  data () {
    return {
      locale: {
        emptyText: <a-empty> </a-empty>
      }
    }
  },
  mixins: [ListMixin]
}
</script>

<style lang="less">
.list-element {
  .ant-table-placeholder {
    display: none;
  }
}
</style>
