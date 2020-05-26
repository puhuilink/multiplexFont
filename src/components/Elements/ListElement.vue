<template>
  <div class="alarm-list-element">

    <!-- S 列表 -->
    <CTable
      :rowKey="el => `${el.arising_time}-${el.kpi_value_num}-${Math.random()}`"
      ref="table"
      :columns="columns"
      :data="loadData"
      :alert="false"
      :scroll="{ x: scrollX, y: 'calc(80vh)' }"
      :pagination="pagination"
      :customHeaderRow="() => ({style: headerRowStyle})"
      :customRow="() => ({style: rowStyle })"
    >
    </CTable>
    <!-- E 列表 -->
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import { KpiCurrentService } from '@/api-hasura'
import { TimeRange } from '@/model/config/dataConfig/dynamicData/index'
import _ from 'lodash'

const defaultColumns = [
  {
    title: '时间',
    dataIndex: 'arising_time',
    width: 180,
    align: 'left',
    sorter: true
  },
  {
    title: '名称',
    // 该字段非数据表字段，为接口返回拼接字段
    dataIndex: 'instanceLabel',
    align: 'left',
    width: 260,
    sorter: false
  }
]

export default {
  name: 'ListElement',
  components: {
    CTable
  },
  props: {
    elementProps: {
      type: Object,
      default: () => ({
        data: [],
        loading: false
      })
    }
  },
  data () {
    return {
      columns: defaultColumns,
      // 自动刷新的定时器
      timer: null,
      rowStyle: {},
      headerRowStyle: {}
    }
  },
  computed: {
    scrollX () {
      return this.columns.map(column => column.width || 60).reduce((x1, x2) => x1 + x2)
    },
    pagination () {
      return {
        // 受限于组件的尺寸，提供相对符合展示效果的分页
        // FIXME: 选择框定位溢出
        pageSizeOptions: ['3', '10', '20', '50', '100'],
        pageSize: 10,
        defaultPageSize: 10
      }
    }
  },
  methods: {
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     */
    loadData (parameter) {
      const { resourceConfig, timeRange } = this.elementProps.params
      if (resourceConfig) {
        const {
          selectedInstance,
          selectedKpi
        } = resourceConfig
        return KpiCurrentService.getValue({
          selectedInstance,
          selectedKpi,
          // 此时拿到的可能是未经实例化的 timeRange 对象
          timeRange: TimeRange.getOption.apply(timeRange),
          fields: [
            'kpi_value_num',
            'arising_time'
          ],
          ...parameter
        }).then(r => {
          const groupByKpi = _.groupBy(r.data, 'kpiLabel')
          this.columns = _.cloneDeep(defaultColumns)
          Object.keys(groupByKpi).forEach(key => {
            this.columns.push({
              title: key,
              dataIndex: 'kpiLabel',
              width: 150,
              align: 'left',
              sorter: false,
              customRender: (text, record) => {
                if (record.kpiLabel === key) {
                  return record.kpi_value_num
                }
              }
            })
          })
          return r
        })
      }
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 30s自动刷新
     */
    refresh (e) {
      const refreshCycle = e * 60000
      this.timer = setInterval(() => {
        this.$refs['table'].refresh(true)
      }, refreshCycle)
    }
  },
  watch: {
    elementProps (props) {
      if (props.isCallInterface) {
        props.isCallInterface = false
        this.$refs['table'].refresh()
      }
      if (props.params.refreshTime) {
        this.refresh(props.params.refreshTime)
      }
      this.headerRowStyle = props.styleConfig.header
      this.rowStyle = props.styleConfig.rows
      this.columns.forEach(e => {
        e.align = props.styleConfig.align
      })
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.timer)
  },
  destroyed () {
    // 清除定时器
    // clearInterval(this.timer)
  }
}
</script>

<style lang="less">
.alarm-list-element {
  padding: 24px;
  .ant-table-thead > tr > th {
    color:inherit !important;
    font-weight: inherit !important;
  }
}
tr > th {
  color:inherit !important;
  font-weight: inherit !important;
}
.rowClass{
  background: red;
}
</style>
