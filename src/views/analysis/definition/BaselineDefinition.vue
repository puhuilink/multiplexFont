/*
 * 动态基线定义管理
 */

<template>
  <div class="baseline-definition">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="动态基线名称">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="节点类型">
                <a-select
                  allowClear
                  v-model="queryParam.nodeType"
                  placeholder="请选择"
                >
                  <a-select-opt-group
                    v-for="(group,index) in nodeType"
                    :key="index"
                    :label="group.label"
                    :allowClear="true"
                  >
                    <a-select-option
                      v-for="item in group.options"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="KPI">
                  <a-select
                    allowClear
                    v-model="queryParam.kpi"
                    placeholder="请选择"
                  >
                    <a-select-opt-group
                      v-for="(group,index) in nodeType"
                      :key="index"
                      :label="group.label"
                      :allowClear="true"
                    >
                      <a-select-option
                        v-for="item in group.options"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </a-select-option>
                    </a-select-opt-group>
                  </a-select>
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
        <a-button>新建</a-button>
        <a-button
          :disabled="selectedRowKeys.length !== 1"
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
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ y:400 }"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      />
      <!-- E 列表 -->
    </a-card>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import screening from '../../alarm/screening'
import deleteCheck from '@/components/DeleteCheck'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'

const query = gql`query instanceList($limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_baseline_def_order_by!]) {
    pagination: t_baseline_def_aggregate(where: {}) {
      aggregate {
        count
      }
    }
  data:  t_baseline_def (offset: $offset, limit: $limit, order_by: $orderBy) {
    calendar_type
    ci_id
    ci_label
    ci_type_label
    ci_type_name
    cycle_day_num
    cycle_default_type
    cycle_month_num
    cycle_quarter_num
    cycle_week_num
    cycle_year_num
    gen_type
    kpi_code
    kpi_label
    round_num
    rule_id
    rule_status
    status
    title
    update_time
    uuid
    uuid_policy
  }
}`
export default {
  name: 'BaselineDefinition',
  components: {
    CTable,
    Ellipsis
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      nodeType: screening.CIType,
      // 告警列表表头
      columns: [
        {
          title: '动态基线名称',
          dataIndex: 'title',
          sorter: true,
          width: 200
          // fixed: 'left'
        },
        {
          title: '节点类型',
          dataIndex: 'ci_type_label',
          width: 150,
          sorter: true
        },
        {
          title: '节点实例',
          dataIndex: 'ci_label',
          width: 100,
          sorter: true
        },
        {
          title: 'KPI名称',
          dataIndex: 'kpi_label',
          width: 100,
          sorter: true
        },
        {
          title: '周期',
          dataIndex: 'cycle_default_type',
          width: 100,
          sorter: true,
          customRender: (text) => {
            text += ''
            switch (text) {
              case 'Day':
                return '按日计算'
              case 'Week':
                return '按周计算'
              default:
                return text
            }
          }
        }
      ],
      loadData: parameter => {
        // 清空选中
        this.selectedRowKeys = []
        return apollo.clients.alert.query({
          query,
          variables: {
            ...parameter,
            ...this.queryParams
          }
        }).then(r => r.data)
      },
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []
    }
  },
  filters: {},
  computed: {},
  methods: {
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
    },
    /**
     * 删除选中项
     */
    async deleteCtrl () {
      await deleteCheck.sureDelete() &&
        console.log('确定删除')
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
