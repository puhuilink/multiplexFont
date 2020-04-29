<template>
  <div class="alarm-list-element">

    <!-- S 列表 -->
    <CTable
      rowKey="arising_time"
      ref="table"
      :columns="columns"
      :data="loadData"
      :alert="false"
      :scroll="{ x: scrollX, y: 350 }"
      :pagination="pagination"
    >
    </CTable>
    <!-- E 列表 -->
  </div>
</template>

<script>
import CTable from '@/components/Table/CTable'
import { KpiCurrentService } from '@/api-hasura'
import { TimeRange } from '@/model/config/dataConfig/dynamicData/index'

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
      columns: [
        {
          title: '时间',
          dataIndex: 'arising_time',
          width: 150,
          // fixed: 'left',
          sorter: true
        },
        {
          title: 'ci',
          // 该字段非数据表字段，为接口返回拼接字段
          dataIndex: 'instanceLabel',
          width: 200
        },
        {
          title: 'kpi',
          // 该字段非数据表字段，为接口返回拼接字段
          dataIndex: 'kpiLabel',
          width: 150
        },
        {
          title: '值',
          dataIndex: 'kpi_value_num',
          width: 100,
          sorter: true
        }
      ],
      // 自动刷新的定时器
      timer: null
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
        })
      }
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 30s自动刷新
     */
    refresh () {
      this.autoRefresh = !this.autoRefresh
      if (this.autoRefresh) {
        this.timer = setInterval(() => {
          this.$refs['table'].refresh(true)
        }, 30000)
      } else {
        clearInterval(this.timer)
      }
    }
  },
  watch: {
    elementProps (props) {
      if (props.isCallInterface) {
        props.isCallInterface = false
        this.$refs['table'].refresh()
      }
    }
  }
}
</script>

<style scoped lang="less">
.alarm-list-element {
  padding: 24px;
}

</style>
