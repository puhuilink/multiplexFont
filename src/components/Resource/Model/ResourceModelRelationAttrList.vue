<template>
  <div class="ResourceModelRelationAttrList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      rowKey="_id_s"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectRow}"
      :scroll="{ x: 1760, y: 850}"
    >
    </CTable>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query ($where:ngecc_relationattribute_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [ngecc_relationattribute_order_by!]) {
  pagination: ngecc_relationattribute_aggregate (where: $where) {
    aggregate {
      count
    }
  }
  data: ngecc_relationattribute (offset: $offset, limit: $limit, where: $where, order_by: $orderBy) {
    did
    _id_s
    name_s
    label_s
    source_s
    target_s
    mappingtype_s
    relationtype_s
    tabgroup_s
    order_i
    allowinheritance_b
    allownull_b
  }
}
`

export default {
  name: 'ResourceModelRelationAttrList',
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
    // TODO: 列不全
    columns: {
      get () {
        return [
          {
            title: '名称',
            dataIndex: 'name_s',
            sorter: true,
            width: 180
          },
          {
            title: '显示名称',
            dataIndex: 'label_s',
            sorter: true,
            width: 300
          },
          {
            title: '源',
            dataIndex: 'source_s',
            sorter: true,
            width: 100
          },
          {
            title: '目标',
            dataIndex: 'target_s',
            sorter: true,
            width: 100
          },
          {
            title: '映射类型',
            dataIndex: 'mappingtype_s',
            sorter: true,
            width: 180
          },
          {
            title: '关系类型',
            dataIndex: 'relationtype_s',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '所属分组',
            dataIndex: 'tabgroup_s',
            sorter: true,
            width: 180
          },
          {
            title: '排序',
            dataIndex: 'order_i',
            sorter: true,
            width: 180
          },
          {
            title: '是否继承',
            dataIndex: 'allowinheritance_b',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '非空',
            dataIndex: 'allownull_b',
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
