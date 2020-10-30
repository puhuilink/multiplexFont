<template>
  <div class="index">
    <CTable
      bordered
      :columns="columns"
      :data="loadData"
      defaultExpandAllRows
      :expandedRowKeys="expandedRowKeys"
      ref="table"
      :rowKey="rowKey"
      :rowSelection="null"
      :showPagination="false"
      :scroll="scroll"
      @expandedRowsChange="events => expandedRowKeys = events"
    >

      <template #query>
        <a-form layout="inline" class="form__only">
          <span :class="advanced ? 'expand' : 'collapse'">
            <a-dropdown>
              <a-menu slot="overlay" @click="toggleExpandedRows">
                <a-menu-item key="expandAll">展开所有</a-menu-item>
                <a-menu-item key="collapseAll">收起所有</a-menu-item>
              </a-menu>
              <a-button>行操作<a-icon type="down" /> </a-button>
            </a-dropdown>
            <QueryBtn @click="query" />
          </span>
        </a-form>
      </template>
    </CTable>

    <HistoryChart ref="historyChart" />
  </div>
</template>

<script>
import { List } from '@/components/Mixins'
import { MetricService } from '@/api-hasura'
import _ from 'lodash'
import moment from 'moment'
import HistoryChart from './HistoryChart'

export default {
  name: 'PerformanceAggregate',
  mixins: [List],
  components: {
    HistoryChart
  },
  props: {},
  data () {
    return {
      expandedRowKeys: [],
      columns: Object.freeze([
        {
          title: '监控实体',
          dataIndex: 'endpoint_alias',
          width: 180,
          tooltip: true,
          customRender: (endpoint_alias, { children }) => children ? endpoint_alias : ''
        },
        {
          title: '检查项',
          dataIndex: 'metric_alias',
          width: 90,
          customRender: (metric_alias, { children }) => children ? '' : metric_alias
        },
        {
          title: '指标值',
          width: 60,
          tooltip: true,
          customRender: (__, { children, metric_value, metric_value_str }) => children ? '' : (metric_value_str || metric_value)
        },
        {
          title: '指标单位',
          width: 60,
          customRender: (__, { children, metric_unit }) => children ? '' : metric_unit
        },
        {
          title: '采集时间',
          dataIndex: 'collect_time',
          width: 70,
          customRender: (__, { children, collect_time }) => children ? '' : moment(collect_time).format()
        },
        {
          title: '历史图',
          width: 35,
          align: 'center',
          customRender: (__, record) => {
            const { children } = record
            const obj = {
              children: '',
              attrs: {}
            }
            if (children) {
              obj.attrs.rowSpan = 1
              // obj.attrs.rowSpan = expanded ? children.length : 1
              obj.children = <a-button icon="bar-chart" onClick={() => this.$refs['historyChart'].showHistory(record)} />
            }
            return obj
          }
        }
      ])
    }
  },
  computed: {
    scrollY () {
      return 'max(calc(100vh - 310px), 100px)'
    },
    host_id () {
      return _.get(this.where, 'host_id._eq') || _.get(this.where, 'host_id')
    }
  },
  watch: {
    where: {
      immediate: true,
      deep: true,
      async handler (where) {
        await this.$nextTick()
        this.$refs['table'].refresh(true)
      }
    }
  },
  methods: {
    loadData (parameter) {
      if (_.isEmpty(this.where)) {
        return {}
      }
      return MetricService
        .aggregateFind({ host_id: this.host_id, ...parameter })
        .then(({ data, pagination }) => {
          this.expandedRowKeys = data.map(row => this.rowKey(row))
          return ({ data, pagination })
        })
    },
    rowKey ({ endpoint_alias = '', metric_id = '' }) {
      return `${endpoint_alias}${metric_id}`
    },
    toggleExpandedRows ({ key }) {
      // 此处封装了三层组件: ATable -> GraphTable -> CTable
      const { table: cTable } = this.$refs
      const { table: gTable } = cTable.$refs
      const { table: aTable } = gTable.$refs
      const { dataSource = [] } = aTable

      this.expandedRowKeys = key === 'collapseAll' ? [] : dataSource.map(row => this.rowKey(row))
    }
  }
}
</script>

<style lang="less">

</style>
