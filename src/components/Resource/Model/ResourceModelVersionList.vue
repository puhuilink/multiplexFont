<template>
  <div class="ResourceModelVersionList">
    <CTable
      ref="table"
      :data="loadData"
      :columns="columns"
      rowKey="_id_x"
      :rowSelection="null"
      :scroll="{ x: 1000, y: 850}"
    >

      <template #query>
        <a-form layout="inline">
          <div class="fold">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="版本号"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input
                    allowClear
                    type="number"
                    min="0"
                    v-model.number="queryParams.version_i"
                    placeholder=""/>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(15.5px)` } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
          </span>
        </a-form>
      </template>
    </CTable>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query ($where: ngecc_modelhistory_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [ngecc_modelhistory_order_by!]) {
  data: ngecc_modelhistory(limit: $limit, offset: $offset, where: $where, order_by: $orderBy) {
    createtime_t
    label_s
    version_i
    name_s
    _id_x
  }
  pagination: ngecc_modelhistory_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}`

export default {
  name: 'ResourceModelVersionList',
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
            ...this.where,
            ...(this.queryParams.version_i !== undefined && this.queryParams.version_i !== '') ? {
              version_i: {
                _eq: Number(this.queryParams.version_i)
              }
            } : {}
          }
        }
      }).then(r => r.data)
    },
    query () {
      this.$refs['table'].refresh(true)
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
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
