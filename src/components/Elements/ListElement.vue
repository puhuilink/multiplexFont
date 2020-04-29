<template>
  <div class="alarm-list-element">

    <!-- S 列表 -->
    <CTable
      ref="table"
      :columns="columns"
      :data="loadData"
      :alert="false"
      :scroll="{ x: 1800, y: 350 }"
    >
    </CTable>
    <!-- E 列表 -->
  </div>
</template>

<script>
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import CTable from '@/components/Table/CTable'

const query = gql`query instanceList($where: t_kpi_current_bool_exp! = {}, $limit: Int! = 0, $offset: Int! = 10, $orderBy: [t_kpi_current_order_by!]) {
  pagination: t_kpi_current_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: t_kpi_current(offset: $offset, limit: $limit, where: $where, order_by: $orderBy) {
    agent_id
    arising_index
    arising_time
    ci_id
    insert_time
    instance_id
    kpi_code
    kpi_value_num
    kpi_value_txt
    notes
    task_id
  }
}`

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
          width: 75,
          fixed: 'left',
          sorter: true
        },
        {
          title: '名称',
          dataIndex: 'state',
          width: 75,
          sorter: true
        },
        {
          title: 'kpi值',
          dataIndex: 'kpi_value_num',
          width: 200,
          sorter: true
        }
      ],
      // 自动刷新的定时器
      timer: null
    }
  },
  created () {},
  methods: {
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     */
    loadData (parameter) {
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.where,
            ...this.elementProps.params.resourceConfig ? {
              ci_id: {
                _in: this.elementProps.params.resourceConfig.selectedInstance
              }
            } : {},
            ...this.elementProps.params.resourceConfig ? {
              kpi_code: {
                _in: this.elementProps.params.resourceConfig.selectedKpi
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
