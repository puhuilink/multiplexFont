<template>
  <div class="ResourceInstanceVersionList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      rowKey="_id_x"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectRow}"
      :scroll="{ x: 1000, y: 850}"
    >
    </CTable>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query ($where: ngecc_instancehistory_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [ngecc_instancehistory_order_by!]) {
  data: ngecc_instancehistory(limit: $limit, offset: $offset, where: $where, order_by: $orderBy) {
    createtime_t
    label_s
    version_i
    name_s
    _id_x
  }
  pagination: ngecc_instancehistory_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}`

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
            dataIndex: '_id_x',
            sorter: true,
            width: 300
          },
          {
            title: '创建时间',
            dataIndex: 'createtime_t',
            sorter: true,
            width: 300
          },
          {
            title: '版本',
            dataIndex: 'version_i',
            sorter: true,
            width: 100
          },
          {
            title: '名称',
            dataIndex: 'label_s',
            sorter: true,
            width: 300
          }
        ]
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
