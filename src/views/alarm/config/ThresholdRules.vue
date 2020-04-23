/*
 * 阈值规则
 */
<template>
  <div class="threshold-rules">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="数据域">
                <a-select
                  allowClear
                  v-model="queryParam.domains"
                  placeholder="请选择"
                >
                  <a-select-option
                    v-for="item in queryList.domainList"
                    :key="item.name_s"
                  >
                    {{ item.label_s }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="节点类型">
                <CiModelSelect
                  v-model="queryParam.model"
                  :value="queryParam.model"
                  @input="onModelInput"
                />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="KPI">
                  <KpiSelect
                    multiple
                    v-model="queryParam.kpi"
                    :nodetypeS="queryParam.model"
                    placeholder
                  />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
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
        <a-button
          type="primary"
          icon="plus"
          @click="$refs.detail.open('', 'New')"
        >
          新建
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length !== 1"
          @click="$refs.detail.open(selectedRows[0], 'Edit')"
        >
          编辑
        </a-button>
        <a-button
          :disabled="selectedRowKeys.length == 0"
          @click="deleteCtrl"
        >
          删除
        </a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 列表 -->
      <CTable
        ref="table"
        size="small"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      >
        <span slot="status" slot-scope="text">
          <a-icon
            v-if="text"
            type="check-circle"
            theme="filled"
            :title="text | statusTitleFilter"
            :style="{color:'#00c356'}"
          />
          <a-icon
            v-else
            type="close-circle"
            theme="filled"
            :title="text | statusTitleFilter"
            :style="{color:'#f97160'}"
          />
        </span>
      </CTable>
      <!-- E 列表 -->

      <!-- S 模块 -->
      <detail
        ref="detail"
        @addSuccess="$refs['table'].refresh(false)"
      ></detail>
      <!-- E 模块 -->
    </a-card>
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import screening from '../screening'
import queryList from '@/api/controller/AlarmqQueryList'
import deleteCheck from '@/components/DeleteCheck'
import detail from './modules/ThresholdRulesDetail'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import {
  CiModelSelect,
  KpiSelect
} from '@/components/Common'

const query = gql`query instanceList($where: t_threshold_bool_exp! = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_threshold_order_by!]) {
    pagination: t_threshold_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  data: t_threshold(offset: $offset, limit: $limit, order_by: $orderBy, where: $where) {
    alert_code
    condition
    domain
    enabled
    enter_count
    exit_count
    id
    ignore_instance
    instance
    keep_count
    kpi_code
    message
    node_ids
    node_type
    ref_value
    title
    threshold_type
    severity
    udapvalue_type
  }
}`
const deleteAttrs = gql`mutation ($idList: [numeric!] = []) {
  delete_t_threshold (where: {
    id: {
      _in: $idList
    }
  }) {
    affected_rows
  }
}`
export default {
  name: 'ThresholdRules',
  components: {
    CTable,
    detail,
    CiModelSelect,
    KpiSelect
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      queryList: {},
      columns: [
        {
          title: '名称',
          dataIndex: 'title',
          sorter: true
        },
        {
          title: '节点类型',
          dataIndex: 'node_type',
          sorter: true
        },
        {
          title: '节点',
          dataIndex: 'node_ids_label',
          sorter: true
        },
        {
          title: '域',
          dataIndex: 'domain',
          sorter: true
        },
        {
          title: 'KPI名称',
          dataIndex: 'kpi_code',
          width: 150,
          sorter: true
        },
        {
          title: 'Alert名称',
          dataIndex: 'alert_code',
          width: 150,
          sorter: true
        },
        {
          title: '级别',
          dataIndex: 'severity',
          width: 100,
          sorter: true,
          customRender: (text) => {
            text += ''
            switch (text) {
              case '0':
                return 'INFO'
              case '1':
                return 'WARNING'
              case '2':
                return 'MINOR'
              case '3':
                return 'MAJOR'
              case '4':
                return 'CRITICAL'
              default:
                return text
            }
          }
        },
        {
          title: '启用',
          dataIndex: 'enabled',
          scopedSlots: { customRender: 'status' }
        }
      ],
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  filters: {
    statusTitleFilter (type) {
      type += ''
      switch (type) {
        case '0':
          return '已启用'
        case '1':
          return '已禁用'
        default:
          return ''
      }
    }
  },
  created () {
    this.getqueryList()
  },
  computed: {
    /**
     * 返回表格选中行
     */
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    query () {
      this.$refs['table'].refresh(true)
    },
    loadData (parameter) {
      this.selectedRowKeys = []
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.queryParam.domain ? {
              domain: {
                _eq: this.queryParam.domain
              }
            } : {},
            ...this.queryParam.model ? {
              node_type: {
                _eq: this.queryParam.model
              }
            } : {},
            ...this.queryParam.kpi_code ? {
              kpi_code: {
                _in: this.queryParam.kpi
              }
            } : {}
          }
        }
      }).then(r => r.data)
    },
    /**
     * 获取筛选项的下拉列表的值
     */
    async getqueryList () {
      this.queryList.domainList = await queryList.domainList()
    },
    onModelInput (str = '') {
      this.queryParam.model = str
      // 重置选中的 Ci 实例
      this.queryParam.node_id = []
    },
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
     * 告警类型改变
     */
    alarmTypeChange (value) {
      this.queryParam.alert_id = screening.checkAll(value, this.queryList.alertList)
    },
    /**
     * 表格展示规则类型过滤
     */
    handleChange (value) {
      console.log(`selected ${value}`)
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
          dblclick: () => {
            this.$refs['detail'].open(record, 'See')
          }
        }
      }
    },
    /**
     * 删除选中项
     */
    async deleteCtrl () {
      console.log(this.selectedRowKeys)
      if (!await deleteCheck.sureDelete()) {
        return
      }
      try {
        this.$refs['table'].loading = true
        console.log(this.selectedRowKeys)
        await apollo.clients.alert.mutate({
          mutation: deleteAttrs,
          variables: {
            idList: [
              ...this.selectedRowKeys
            ]
          }
        })
        this.$notification.success({
          message: '系统提示',
          description: '删除成功'
        })
        // FIXME: 是否存在分页问题
        this.$refs['table'].refresh(false)
      } catch (e) {
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
