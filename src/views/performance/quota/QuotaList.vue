<template>
  <div class="quota-list">
    <a-card :borderd="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="是否巡检">
                <a-select
                  allowClear
                  v-model="queryParam.polling"
                  placeholder="请选择"
                  default-value="checkall"
                >
                  <a-select-option value="0">是</a-select-option>
                  <a-select-option value="1">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="显示名称">
                  <a-input v-model="queryParam.showName" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="中文描述">
                  <a-input v-model="queryParam.describe" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="KPI编码">
                  <a-input v-model="queryParam.KPICode" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="是否KPI">
                  <a-input v-model="queryParam.KPI" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="所属节点类型">
                  <a-input v-model="queryParam.nodeType" placeholder=""/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- E 搜索 -->

      <!-- S 操作栏 -->
      <div class="opration">
        <a-button @click="add">新建</a-button>
        <a-button :disabled="!hasSelected">编辑</a-button>
        <a-button @click="batchDelete" :disabled="!hasSelected">删除</a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 列表 -->
      <s-table
        ref="table"
        size="small"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x: 1300, y:400 }"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      />
      <!-- E 列表 -->
    </a-card>

    <QuotaSchema
      ref="schema"
    />
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getQuotaList } from '@/api/quotaList'
import QuotaSchema from './QuotaSchema'
import deleteCheck from '@/components/DeleteCheck'

export default {
  name: 'QuotaList',
  components: {
    STable,
    Ellipsis,
    QuotaSchema
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 告警列表表头
      columns: [
        {
          title: '更新时间',
          dataIndex: 'refreshTime',
          sorter: true,
          align: 'center',
          width: 160,
          fixed: 'left'
        },
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          sorter: true
        },
        {
          title: '显示名称',
          dataIndex: 'showName',
          align: 'center',
          width: 200
        },
        {
          title: '图标',
          dataIndex: 'icon',
          align: 'center',
          width: 100
        },
        {
          title: '数据权限域',
          dataIndex: 'domain',
          align: 'center',
          width: 120,
          sorter: true
        },
        {
          title: 'Kpi编码',
          dataIndex: 'KPICode',
          align: 'center',
          width: 100
        },
        {
          title: '所属模型',
          dataIndex: 'model',
          align: 'center',
          width: 120
        }
      ],
      loadData: parameter => {
        // this.selectedRowKeys = []
        return getQuotaList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },
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
</style>
