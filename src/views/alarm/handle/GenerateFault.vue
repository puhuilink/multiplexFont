/*
 * 生成故障
 */
<template>
  <div class="generate-fault">
    <a-card :bordered="false">
      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="故障状态">
                <a-select
                  allowClear
                  v-model="queryParam.incident_state"
                  placeholder="请选择"
                  default-value="checkall"
                >
                  <a-select-option
                    v-for="item in incidentStateList"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="故障规则">
                <a-select
                  allowClear
                  v-model="queryParam.faultRule"
                  placeholder="请选择"
                  default-value="checkall"
                >
                  <a-select-option
                    v-for="item in incidentStateList"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="故障类型">
                  <a-input v-model="queryParam.incident_type" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="开始时间">
                  <a-date-picker
                    showTime
                    placeholder="Select Begin Time"
                    @change="onDataChange"
                    @ok="onDataOk"
                    v-model="queryParam.beginTime"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="结束时间">
                  <a-date-picker
                    showTime
                    placeholder="Select End Time"
                    @change="onDataChange"
                    @ok="onDataOk"
                    v-model="queryParam.endTime"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="创建人">
                  <a-input v-model="queryParam.originator" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="解决人">
                  <a-input v-model="queryParam.solveMan" placeholder=""/>
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
        <a-button>查看告警</a-button>
        <a-button>显示设置</a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 列表 -->
      <C-table
        ref="table"
        size="small"
        rowKey="incident_id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x: scrollX, y:`calc(100vh - 300px)` }"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      >
        <!-- <template #query>
        </template> -->
        <span slot="message" slot-scope="text">
          <ellipsis :length="40" tooltip>{{ text }}</ellipsis>
        </span>
      </C-table>
      <!-- E 列表 -->
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
// import { getGenerateFaultList } from '@/api/generateFault'
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query($where: t_incident_bool_exp! = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_incident_order_by!]) {
  pagination: t_incident_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: t_incident(offset: $offset, limit: $limit, order_by: $orderBy, where: $where) {
    active_by
    active_time
    forward_destination
    forward_records
    forward_type
    incident_alert_size
    incident_description
    incident_id
    incident_severity
    incident_state
    incident_type
    life_cycle
    mandatory_alert_ids
    optional_alert_ids
    order_comments
    order_id
    order_status
    prepare_time
    resolve_by
    resolve_time
    rule_id
    rule_title
    seal_time
    send_count
    send_cycle
    update_time
  }
}`
export default {
  name: 'GenerateFault',
  components: {
    STable,
    Ellipsis,
    CTable
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      incidentStateList: [
        {
          value: -10,
          label: '已取消'
        },
        {
          value: 0,
          label: '已产生'
        },
        {
          vlaue: 10,
          label: '已激活'
        },
        {
          value: 20,
          label: '已封挡'
        },
        {
          value: 30,
          label: '已解决'
        }
      ],
      // 告警列表表头
      columns: [
        {
          title: '故障编号',
          dataIndex: 'incident_id',
          sorter: true,
          align: 'center',
          width: 200
        },
        {
          title: '故障状态',
          dataIndex: 'incident_state',
          align: 'center',
          width: 100,
          sorter: true,
          customRender: (text) => {
            this.incidentStateList.forEach(element => {
              if (element.value === text) {
                text = element.label
              }
            })
            return text
          }
        },
        {
          title: '前转规则名称',
          dataIndex: 'forward_rule_title',
          align: 'left',
          width: 200
        },
        {
          title: '故障级别',
          dataIndex: 'incident_severity',
          align: 'center',
          width: 100,
          sorter: true
        },
        {
          title: '故障类型',
          dataIndex: 'incident_type',
          width: 120,
          sorter: true
        },
        {
          title: '故障描述',
          dataIndex: 'incident_description',
          width: 300,
          scopedSlots: { customRender: 'message' },
          sorter: true
          // ellipsis: true
        },
        {
          title: '最大告警数量',
          dataIndex: 'incident_alertSize',
          width: 150,
          sorter: true
        },
        {
          title: '创建人',
          dataIndex: 'active_by',
          width: 150,
          sorter: true
        },
        {
          title: '解决人',
          dataIndex: 'resolve_by',
          width: 150,
          sorter: true
        },
        {
          title: '产生时间',
          dataIndex: 'active_time',
          width: 180,
          sorter: true
        },
        {
          title: '激活时间',
          dataIndex: 'send_active_time',
          width: 180,
          sorter: true
        },
        {
          title: '封挡时间',
          dataIndex: 'seal_time',
          width: 180,
          sorter: true
        },
        {
          title: '解决时间',
          dataIndex: 'prepare_time',
          sorter: true,
          width: 180
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
    scrollX: {
      get () {
        return this.columns.map(e => e.width || 0).reduce((x1, x2) => (x1 + x2))
      }
    }
  },
  methods: {
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },

    loadData (parameter) {
      // 清空选中
      this.selectedRowKeys = []
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.where,
            ...this.queryParam.domains ? {
              domains: {
                _eq: this.queryParam.domains
              }
            } : {},
            ...this.queryParam.node_types ? {
              node_types: {
                _eq: this.queryParam.node_types
              }
            } : {},
            ...this.queryParam.node_ids ? {
              node_ids: {
                _in: this.queryParam.node_ids
              }
            } : {},
            ...this.queryParam.alert_id ? {
              alert_id: {
                _in: this.queryParam.alert_id
              }
            } : {},
            ...this.queryParam.agent_id ? {
              agent_id: {
                _in: this.queryParam.agent_id
              }
            } : {},
            ...this.queryParam.state ? {
              state: {
                _eq: this.queryParam.state
              }
            } : {},
            ...this.queryParam.severity ? {
              severity: {
                _eq: this.queryParam.severity
              }
            } : {},
            ...this.queryParam.message ? {
              message: {
                _ilike: this.queryParam.message
              }
            } : {}
          }
        }
      }).then(r => r.data)
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
