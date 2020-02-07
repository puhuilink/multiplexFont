<template>
  <div class="ResourceModelAttrList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      rowKey="_id_s"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectRow}"
      :scroll="{ x: 1580, y: 850}"
    >
      <template #operation>
        <a-button @click="add">新建</a-button>
        <a-button :disabled="selectedRowKeys.length !== 1">编辑</a-button>
        <a-button @click="batchDelete" :disabled="selectedRowKeys.length === 0">删除</a-button>
        <a-button>数据检查</a-button>
        <a-button>筛选</a-button>
      </template>
    </CTable>

    <ResourceModelAttrSchema
      ref="schema"
    />
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import ResourceModelAttrSchema from './ResourceModelAttrSchema'
import deleteCheck from '@/components/DeleteCheck'

const query = gql`query ($where:ngecc_model_attributes_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [ngecc_model_attributes_order_by!]) {
  pagination: ngecc_model_attributes_aggregate (where: $where) {
    aggregate {
      count
    }
  }
  data: ngecc_model_attributes (offset: $offset, limit: $limit, where: $where, order_by: $orderBy) {
    did
    _id_s
    label_s
    name_s
    width_i
    datatype_s
    displaytype_s
    allownull_b
    sourcevalue_s
    allowinheritance_b
    hidden_b
  }
}
`

export default {
  name: 'ResourceModelAttrList',
  components: {
    CTable,
    ResourceModelAttrSchema
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
    // 选中行
    selectedRows: [],
    // 选中行的 key
    selectedRowKeys: []
  }),
  computed: {
    // TODO: 列不全
    columns: {
      get () {
        return [
          {
            title: '显示名称',
            dataIndex: 'label_s',
            sorter: true,
            width: 180
          },
          {
            title: '属性名称',
            dataIndex: 'name_s',
            sorter: true,
            width: 300
          },
          {
            title: '显示宽度',
            dataIndex: 'width_i',
            sorter: true,
            width: 100
          },
          {
            title: '数据类型',
            dataIndex: 'datatype_s',
            sorter: true,
            width: 100
          },
          {
            title: '显示类型',
            dataIndex: 'displaytype_s',
            sorter: true,
            width: 180
          },
          {
            title: '非空',
            dataIndex: 'allownull_b',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '源值',
            dataIndex: 'sourcevalue_s',
            sorter: true,
            width: 180
          },
          {
            title: '继承',
            dataIndex: 'allowinheritance_b',
            sorter: true,
            width: 180,
            customRender: val => val ? '是' : '否'
          },
          {
            title: '隐藏',
            dataIndex: 'hidden_b',
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
    add () {
      this.$refs['schema'].add()
    },
    async batchDelete () {
      await deleteCheck.sureDelete()
    },
    edit () {
      const [record] = this.selectedRows
      this.$refs['shcema'].edit(record)
    },
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
    selectRow (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
