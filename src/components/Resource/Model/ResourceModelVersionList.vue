<template>
  <div class="ResourceInstanceVersionList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      rowKey="_id"
      :rowSelection="null"
      :scroll="{ x: scrollX, y: `calc(100vh - 290px)`}"
    >
    </CTable>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import { ModelHistoryService } from '@/api-hasura'

export default {
  name: 'ResourceInstanceVersionList',
  components: {
    CTable
  },
  props: {
    where: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    // 查询参数
    queryParams: {},
    // 选中行的 key
    selectedRowKeys: []
  }),
  computed: {
    columns: {
      get () {
        return [
          {
            title: '编号',
            dataIndex: '_id',
            sorter: true,
            width: 300
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: true,
            width: 300
          },
          {
            title: '版本',
            dataIndex: 'version',
            sorter: true,
            width: 100
          },
          {
            title: '名称',
            dataIndex: 'label',
            sorter: true,
            width: 300
          }
        ]
      }
    },
    scrollX: {
      get () {
        return this.columns
          .map(e => e.width || 60)
          .reduce((a, b) => a + b) + 62
      }
    }
  },
  watch: {
    '$props': {
      immediate: false,
      deep: true,
      handler () {
        // 重置查询条件
        this.reset()
        // 重新查询
        this.$refs['table'].refresh(true)
      }
    }
  },
  methods: {
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     * @return {Function: <Promise<Any>>}
     */
    loadData (parameter) {
      return ModelHistoryService.find({
        ...parameter,
        where: {
          ...this.where
        },
        fields: this.columns.map(column => column.dataIndex),
        alias: 'data'
      }).then(r => r.data)
    },
    /**
     * 表格行选中
     * @event
     * @return {Undefined}
     */
    selectRow (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    /**
     * 重置组件数据
     */
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">

</style>
