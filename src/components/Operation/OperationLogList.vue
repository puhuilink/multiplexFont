<template>
  <div class="OperationLogList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      rowKey="_id_x"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectRow}"
      :scroll="{ x: 1820, y: 850}"
    >
    </CTable>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query ($where:ngecc_operationlog_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [ngecc_operationlog_order_by!]) {
  data: ngecc_operationlog(limit: $limit, offset: $offset, where: $where, order_by: $orderBy) {
    _id_x
    modelname_s
    name_s
    operator_s
    operation_s
    operatingtime_t
    operationresult_s
    relationid_s
    relation_b
  }
  pagination: ngecc_operationlog_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}`

export default {
  name: 'OperationLogList',
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
    // FIXME: 小屏下只展示出了部分列
    columns: {
      get () {
        return [
          {
            title: '操作人',
            dataIndex: 'modelname_s',
            sorter: true,
            width: 180
          },
          {
            title: '操作时间',
            dataIndex: 'operatingtime_t',
            sorter: true,
            width: 300
          },
          {
            title: '操作节点名称',
            dataIndex: 'name_s',
            sorter: true,
            width: 500
          },
          {
            title: '数据关联编号',
            dataIndex: 'relationid_s',
            sorter: true,
            width: 300
          },
          {
            title: '操作类型',
            dataIndex: 'operation_s',
            sorter: true,
            width: 180
          },
          {
            title: '操作结果类型',
            dataIndex: 'operationresult_s',
            sorter: true,
            width: 180
          },
          {
            title: '是否为关系',
            dataIndex: 'relation_b',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          }
        ]
      }
    }
  },
  watch: {
    '$props': {
      immediate: false,
      deep: true,
      handler (val) {
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
      return apollo.clients.resource.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.where
          }
        }
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
