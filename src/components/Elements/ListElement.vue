<template>
  <div class="alarm-list-element">

    <!-- S 列表 -->
    <CTable
      ref="table"
      rowKey="alert_id"
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

const query = gql`query instanceList($where: t_alert_bool_exp! = {}, $limit: Int! = 0, $offset: Int! = 10, $orderBy: [t_alert_order_by!]) {
  pagination: t_alert_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: t_alert(offset: $offset, limit: $limit, where: $where, order_by: $orderBy) {
    arising_time
    first_arising_time
    message
    state
    app_name
    dev_name
    instance
    alert_id
    severity
    count
    agent_id
    agent_name
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
      tabKey: '0',
      // 搜索： 展开/关闭
      advanced: false,
      columns: [
        {
          title: '级别',
          dataIndex: 'severity',
          width: 75,
          fixed: 'left',
          sorter: true,
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 75,
          sorter: true,
          scopedSlots: { customRender: 'state' }
        },
        {
          title: 'CI名称',
          dataIndex: 'dev_name',
          width: 200,
          sorter: true
        },
        {
          title: '应用名称',
          dataIndex: 'app_name',
          width: 300,
          sorter: true
        },
        {
          title: '消息内容',
          dataIndex: 'message',
          width: 420,
          scopedSlots: { customRender: 'message' }
        },
        {
          title: '首次告警时间',
          dataIndex: 'first_arising_time',
          width: 150,
          sorter: true
        },
        {
          title: '最近告警时间',
          dataIndex: 'arising_time',
          width: 150,
          sorter: true
        },
        {
          title: '次数',
          dataIndex: 'count',
          width: 70,
          sorter: true
        },
        {
          title: '采集系统',
          dataIndex: 'agent_id',
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
      // 清空选中
      this.selectedRowKeys = []
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.where,
            arising_time: {
              _gte: '2018-5-31 00:00:00',
              _lte: '2018-5-31 23:59:59'
            },
            ...this.elementProps.domains ? {
              domains: {
                _eq: this.elementProps.domains
              }
            } : {},
            ...this.elementProps.model ? {
              node_types: {
                _eq: this.elementProps.model
              }
            } : {},
            ...this.elementProps.selectedInstance ? {
              node_ids: {
                _in: this.elementProps.selectedInstance
              }
            } : {},
            ...this.elementProps.alarmType ? {
              alert_id: {
                _in: this.elementProps.alarmType
              }
            } : {},
            ...this.elementProps.collectionSystem ? {
              agent_id: {
                _in: this.elementProps.collectionSystem
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
