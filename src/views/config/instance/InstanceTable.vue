<template>
  <GraphTable
    rowKey="_id_s"
    :columns="columns"
    :dataSource="dataSource"
    :loading="$apollo.queries.dataSource.loading"
    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectRow}"
    @change="change"
  >

    <!-- / 查询 -->
    <template #query>
      <a-form layout="inline">
        <a-row>
          <div>
            <a-col :md="12" :sm="24">
              <a-form-item label="name">
                <a-input allowClear v-model="queryParams.name_s" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="display name">
                <a-input allowClear v-model="queryParams.label_s" />
              </a-form-item>
            </a-col>
          </div>
        </a-row>
      </a-form>
    </template>

    <!-- / 操作 -->
    <template #opration>
      <a-button>新建</a-button>
      <a-button :disabled="selectedRowKeys.length !== 1">编辑</a-button>
      <a-button :disabled="selectedRowKeys.length === 0">删除</a-button>
      <a-button>数据检查</a-button>
      <a-button>筛选</a-button>
    </template>

  </GraphTable>
</template>

<script>
import gql from 'graphql-tag'
import GraphTable from '@/components/GraphTable'

export default {
  name: 'InstanceTable',
  apollo: {
    dataSource: {
      query: gql`query MyQuery($parentname_s: String!, $limit: Int!, $offset: Int!, $sortField: String!, $sortOrder: order_by!) {
        ngecc_instance(offset: $offset, limit: $limit, where: {parentname_s: {_eq: $parentname_s}}, order_by: {_id_s: $sortOrder}) {
          _class_s
          _id_s
          createtime_t
          creator_s
          label_s
          name_s
          parentname_s
          parenttree_s
          permissionallowextend_b
          updatetime_t
          updator_s
          values_e
          version_i
        }
      }`,
      skip () {
        return !this.parentnameS
      },
      update (data) {
        this.selectedRowKeys = []
        return data.ngecc_instance
      },
      variables () {
        return {
          parentname_s: this.parentnameS,
          limit: this.paginationInfo.pageSize,
          offset: (this.paginationInfo.current - 1) * this.paginationInfo.pageSize,
          // TODO: 变量作为 Object.name 传入查询
          sortField: this.sorter.field || '_id_s',
          sortOrder: this.sorter.order === 'descend' ? 'desc' : 'asc'
        }
      }
    }
  },
  props: {
    parentnameS: {
      type: String,
      default: ''
    }
  },
  components: {
    GraphTable
  },
  data: () => ({
    // 表格数据
    dataSource: [],
    // 查询参数
    queryParams: {},
    // 选中行的 key
    selectedRowKeys: [],
    // 表格排序条件
    sorter: {
      field: '_id_s',
      order: 'descend'
    },
    // 当前分页信息
    paginationInfo: {
      current: 1,
      pageSize: 10
    }

  }),
  computed: {
    columns: {
      get () {
        return [
          {
            title: 'ID',
            dataIndex: '_id_s',
            sorter: true,
            width: 120
          },
          {
            title: 'name',
            dataIndex: 'name_s',
            sorter: true,
            width: 180
          },
          {
            title: 'display name',
            dataIndex: 'label_s',
            sorter: true,
            width: 180
          },
          {
            title: 'parent',
            dataIndex: 'parentname_s',
            width: 120
          },
          {
            title: 'icon',
            dataIndex: 'icon_s',
            width: 120
          }
        ]
      }
    }
  },
  methods: {
    /**
     * 表格翻页、排序等
     * @event
     * @return {Undefined}
     */
    change (paginationInfo, filters, sorter) {
      this.paginationInfo = paginationInfo
      this.sorter = sorter
    },
    /**
     * 表格行选中
     * @event
     * @return {Undefined}
     */
    selectRow (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  }
}
</script>

<style lang="less">
</style>
