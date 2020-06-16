<template>
  <div class="ForwardBoilerplate">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
    </CTable>
  </div>
</template>

<script>
import { List } from '@/components/Mixins'

export default {
  name: 'ForwardBoilerplate',
  mixins: [List],
  components: {},
  props: {},
  data: () => ({
    columns: Object.freeze([
      {
        title: '前转编号',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true
      },
      {
        title: '前转名称',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true
      },
      {
        title: '关联告警',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true
      },
      {
        title: '事件等级',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true
      },
      {
        title: '前转模板',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true
      },
      {
        title: '前转方式',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true
      },
      {
        title: '更新时间',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true
      },
      {
        title: '创建时间',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true
      },
      {
        title: '启用状态',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true
      }

    ])
  }),
  computed: {},
  methods: {
    loadData () {}
  }
}
</script>

<style lang="less">

</style>
