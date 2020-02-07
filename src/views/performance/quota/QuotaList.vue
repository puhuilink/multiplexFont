<template>
  <div class="quota-list">
    <!-- S 列表 -->
    <CTable
      ref="table"
      rowKey="rid"
      :columns="columns"
      :data="loadData"
      :scroll="{ x: 1340, y:650 }"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <template #query>
        <a-form layout="inline">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="名称"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.name_s" placeholder=""/>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item
                  label="显示名称"
                  :labelCol="{ span: 4 }"
                  :wrapperCol="{ span: 14, offset: 2 }"
                  style="width: 100%"
                >
                  <a-input v-model="queryParams.label_s" placeholder=""/>
                </a-form-item>
              </a-col>
            </a-row>

            <div v-show="advanced">
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="KPI编码"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset: 2 }"
                    style="width: 100%"
                  >
                    <a-input v-model="queryParams.kpicode_s" placeholder=""/>
                  </a-form-item>
                </a-col>

                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="所属模型"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset: 2 }"
                    style="width: 100%"
                  >
                    <a-input v-model="queryParams.nodetype_s" placeholder=""/>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>

          </div>

          <!-- TODO: 统一管理布局 -->
          <!-- TODO: 居中 span -->
          <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="queryParams = {}">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
          </span>
        </a-form>
      </template>

      <template #operation>
        <a-button @click="add">新建</a-button>
        <a-button :disabled="!hasSelectedOne">编辑</a-button>
        <a-button @click="batchDelete" :disabled="!hasSelected">删除</a-button>
      </template>
    </CTable>

    <QuotaSchema
      ref="schema"
    />
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import QuotaSchema from './QuotaSchema'
import deleteCheck from '@/components/DeleteCheck'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import CTable from '@/components/Table/CTable'
import Template from '../../design/moduels/template/index'

const query = gql`query ($where: ngecc_instance_values_bool_exp = {}, $limit: Int! = 50, $offset: Int! = 0, $orderBy: [ngecc_instance_values_order_by!]) {
  pagination: ngecc_instance_values_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: ngecc_instance_values (where: $where, limit: $limit, offset: $offset, order_by: $orderBy) {
    rid
    updatetime_t
    name_s
    label_s
    icon_s
    domain_s
    kpicode_s
    nodetype_s
  }
}
`

export default {
  name: 'QuotaList',
  components: {
    Template,
    CTable,
    Ellipsis,
    QuotaSchema
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParams: {},
      // 告警列表表头
      columns: [
        {
          title: '更新时间',
          dataIndex: 'updatetime_t',
          sorter: true,
          width: 200
        },
        {
          title: '名称',
          dataIndex: 'name_s',
          sorter: true,
          width: 410
        },
        {
          title: '显示名称',
          dataIndex: 'label_s',
          sorter: true,
          width: 230
        },
        {
          title: '图标',
          dataIndex: 'icon_s',
          sorter: true,
          width: 80
        },
        {
          title: '数据权限域',
          dataIndex: 'domain_s',
          width: 120,
          sorter: true
        },
        {
          title: 'Kpi编码',
          dataIndex: 'kpicode_s',
          sorter: true,
          width: 100
        },
        {
          title: '所属模型',
          dataIndex: 'nodetype_s',
          sorter: true,
          width: 220
        }
      ],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  filters: {},
  computed: {
    /**
     * 返回表格选中行
     */
    hasSelected () {
      return this.selectedRowKeys.length > 0
    },
    hasSelectedOne () {
      return this.selectedRowKeys.length === 1
    }
  },
  methods: {
    add () {
      this.$refs['schema'].add()
    },
    async batchDelete () {
      await deleteCheck.sureDelete()
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
            ...this.where,
            'parentname_s': {
              '_eq': 'Kpi'
            },
            ...this.queryParams.name_s ? {
              name_s: {
                _ilike: `%${this.queryParams.name_s.trim()}%`
              }
            } : {},
            ...this.queryParams.label_s ? {
              label_s: {
                _ilike: `%${this.queryParams.label_s.trim()}%`
              }
            } : {},
            ...this.queryParams.kpicode_s ? {
              kpicode_s: {
                _ilike: `%${this.queryParams.kpicode_s.trim()}%`
              }
            } : {},
            ...this.queryParams.nodetype_s ? {
              nodetype_s: {
                _ilike: `%${this.queryParams.nodetype_s.trim()}%`
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
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
     * 日期时间空间选择
     */
    onDataChange (value, dateString) {
      console.log('Selected Time: ', value)
      console.log('Formatted Selected Time: ', dateString)
    },
    onDataOk (value) {
      console.log('onOk: ', value)
    },
    /**
     * 选中行更改事件
     * @param selectedRowKeys
     * @param selectedRows
     */
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /**
     * 行属性,表格点击事件
     */
    customRow (record, index) {
      return {
        on: {
          click: () => {
            console.log(record, index)
          }
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.opration{
  margin-bottom: 10px;
  button{
    margin-right: 5px;
  }
}
.fold {
  display: inline-block;
  width: calc(100% - 216px);
}
</style>
