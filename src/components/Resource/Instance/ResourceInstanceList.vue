<template>
  <CTable
    ref="table"
    :data="loadData"
    :columns="columns"
    rowKey="_id_s"
    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: selectRow}"
    :scroll="{ x: 1200, y: 850}"
  >

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

    <template #opration>
      <a-button>新建</a-button>
      <a-button :disabled="selectedRowKeys.length !== 1">编辑</a-button>
      <a-button :disabled="selectedRowKeys.length === 0">删除</a-button>
      <a-button>数据检查</a-button>
      <a-button>筛选</a-button>
    </template>

  </CTable>
</template>

<script>
import CTable from '@/components/Table/CTable'
import Resource from '@/graphql/service/Resource'

export default {
  name: 'ResourceInstanceList',
  props: {
    parentnameS: {
      type: String,
      default: ''
    }
  },
  components: {
    CTable
  },
  data: () => ({
    // 表格数据
    dataSource: [],
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
            title: 'ID',
            dataIndex: '_id_s',
            sorter: true,
            width: 180
          },
          {
            title: 'name',
            dataIndex: 'name_s',
            sorter: true,
            width: 300
          },
          {
            title: 'display name',
            dataIndex: 'label_s',
            sorter: true,
            width: 300
          },
          {
            title: 'parent',
            dataIndex: 'parentname_s',
            width: 300
          },
          {
            title: 'icon',
            dataIndex: 'icon_s',
            width: 180
          }
        ]
      }
    }
  },
  watch: {
    parentnameS: {
      immediate: false,
      handler (val) {
        // 重置查询条件
        Object.assign(this.$data, this.$options.data.apply(this))
        // 重新查询
        val && this.$refs['table'].refresh(true)
      }
    }
  },
  methods: {
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序数据
     * @return {Function: <Promise<Any>>}
     */
    loadData (parameter) {
      return Resource.instanceList({
        ...parameter,
        ...this.queryParams,
        parentname_s: this.parentnameS
      })
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
