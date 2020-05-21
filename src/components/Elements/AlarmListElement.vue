<template>
  <div class="alarm-list-element">

    <CTable
      ref="table"
      rowKey="alert_id"
      :columns="columns"
      :data="loadData"
      :alert="false"
      :scroll="{ x: scrollX, y: 'calc(80vh)' }"
      :pagination="pagination"
      :customHeaderRow="() => ({style: headerRowStyle})"
      :customRow="customRow"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >

      <template #operation >
        <a-row >
          <a-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="{span: 8}"
            :xl="{span: 6}"
            class="table-operator">
            <a-button
              @click="$refs.confirm.open(selectedRowKeys)"
              :disabled="!selectedRowKeys.length > 0 || tabKey==='5'"
              :style="buttonStyle"
            >确认</a-button>
            <a-button
              @click="$refs.rollForward.open(selectedRowKeys, selectedRows)"
              :disabled="!selectedRowKeys.length > 0 "
              :style="buttonStyle"
            >前转</a-button>
            <a-button
              @click="$refs.resolve.open(selectedRowKeys)"
              :disabled="!selectedRowKeys.length > 0 || tabKey==='20' || tabKey==='30'"
              :style="buttonStyle"
            >解决</a-button>
          </a-col>
          <a-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="{span: 24}"
            :xl="{span: 18}"
            style="text-align: right;"
          >
            <a-icon style="padding:0px 12px;" type="sync" v-if="!autoRefresh" @click="refresh" title="打开自动刷新" />
            <a-icon
              style="padding:0px 12px; color:#1890ff"
              spin
              type="sync"
              v-else
              @click="refresh"
              title="关闭自动刷新" />
            <a-icon :style="playAudio?'padding:0px 15px;color:#1890ff':'padding:0px 15px;'" type="sound" @click="onClickSound" />
            <audio src="" id="eventAudio" loop="loop" hidden></audio>
            <div class="levelContent" v-for=" (value, text) in alarmLevelList" :key="text">
              <a-badge
                :count="text | levelFilter"
                :title="text | levelTitleFilter"
                :numberStyle="text==4?{backgroundColor:'#ff0000'}:text==3?{backgroundColor:'#f7870a'}:
                  text==2?{backgroundColor:'#ffdb00'}:text==1?{backgroundColor:'#54b9e4'}:
                    text==0?{backgroundColor:'#00c356'}:{}"
              />
              <span style="padding-left:7px; ">{{ value }}</span>
            </div>
          </a-col>
        </a-row>
      </template>

      <span slot="level" slot-scope="text">
        <a-badge
          :count="text | levelFilter"
          :title="text | levelTitleFilter"
          :numberStyle="text==4?{backgroundColor:'#ff0000'}:text==3?{backgroundColor:'#f7870a'}:
            text==2?{backgroundColor:'#ffdb00'}:text==1?{backgroundColor:'#54b9e4'}:
              text==0?{backgroundColor:'#00c356'}:{}"
        />
      </span>
      <span slot="state" slot-scope="text">
        <a-icon
          type="flag"
          theme="filled"
          :title="text | acStateTitleFilter"
          :style="text=='0'?{color:'#c4c4c4', fontSize:'18px'}:text=='5'?{color:'#00aaf', fontSize:'18px'}:
            text=='10'?{color:'#f99025', fontSize:'18px'}:text=='20'?{color:'#39cc39', fontSize:'18px'}:
              text=='30'?{color:'#000000', fontSize:'18px'}:{}"
        />
      </span>
      <span slot="message" slot-scope="text">
        <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
      </span>
    </CTable>
    <!-- / 列表 -->

    <m-confirm ref="confirm" @ok="() => $refs['table'].refresh(true)"></m-confirm>
    <roll-forward ref="rollForward" @ok="() => $refs['table'].refresh(true)"></roll-forward>
    <m-solve ref="resolve" @ok="() => $refs['table'].refresh(true)"></m-solve>
    <m-detail
      ref="detail"
      @handleForward="$refs.rollForward.open()"
      @handleSolve="$refs.resolve.open()"
      @eventQuery="eventQuery"
      @operation="$refs.operation.open(record)"
      @correlation="$refs.correlation.open(record)"
    />
    <event-query ref="eventQuery"></event-query>
    <operation ref="operation"></operation>
    <correlation ref="correlation"></correlation>
    <!-- / model模块 -->
  </div>
</template>

<script>
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import screening from '@/views/alarm/screening'
import MConfirm from '@/views/alarm/modules/MConfirm'
import RollForward from '@/views/alarm/modules/RollForward'
import MSolve from '@/views/alarm/modules/MSolve'
import MDetail from '@/views/alarm/modules/MDetail'
import EventQuery from '@/views/alarm/modules/MEventQuery'
import Operation from '@/views/alarm/modules/OperationLog'
import correlation from '@/views/alarm/modules/MCorrelation'

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
const levelQuery = gql`query($state: numeric!,$arising_time_gte: timestamp!, $arising_time_lte: timestamp! ) {
  L1: t_alert_aggregate(where: {state:{_eq: $state},severity:{_eq:0},arising_time: {_gte: $arising_time_gte, _lte: $arising_time_lte}}) {
    aggregate {
      count
    }
  }
  L2: t_alert_aggregate(where: {state:{_eq: $state},severity:{_eq:1},arising_time: {_gte: $arising_time_gte, _lte: $arising_time_lte}}) {
    aggregate {
      count
    }
  }
  L3:t_alert_aggregate(where: {state:{_eq: $state},severity:{_eq:2},arising_time: {_gte: $arising_time_gte, _lte: $arising_time_lte}}) {
    aggregate {
      count
    }
  }
  L4:t_alert_aggregate(where: {state:{_eq: $state},severity:{_eq:3},arising_time: {_gte: $arising_time_gte, _lte: $arising_time_lte}}) {
    aggregate {
      count
    }
  }
  L5:t_alert_aggregate(where: {state:{_eq: $state},severity:{_eq:4},arising_time: {_gte: $arising_time_gte, _lte: $arising_time_lte}}) {
    aggregate {
      count
    }
  },
  m1: t_alert_aggregate(where: {state: {_eq: 0}, arising_time: {_gte: $arising_time_gte, _lte: $arising_time_lte}}) {
    aggregate {
      count
    }
  }
  m2: t_alert_aggregate(where: {state: {_eq: 5}, arising_time: {_gte: $arising_time_gte, _lte: $arising_time_lte}}) {
    aggregate {
      count
    }
  }
  m3: t_alert_aggregate(where: {state: {_eq: 10}, arising_time: {_gte: $arising_time_gte, _lte: $arising_time_lte}}) {
    aggregate {
      count
    }
  }
  m4: t_alert_aggregate(where: {state: {_eq: 20}, arising_time: {_gte: $arising_time_gte, _lte: $arising_time_lte}}) {
    aggregate {
      count
    }
  }
  m5: t_alert_aggregate(where: {state: {_eq: 30}, arising_time: {_gte: $arising_time_gte, _lte: $arising_time_lte}}) {
    aggregate {
      count
    }
  }
}`

export default {
  name: 'AlarmListElement',
  components: {
    CTable,
    Ellipsis,
    MConfirm,
    RollForward,
    MSolve,
    MDetail,
    EventQuery,
    Operation,
    correlation
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
      // 自动刷新
      autoRefresh: false,
      // 是否播放告警音频
      playAudio: false,
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
      timer: null,
      alarmLevelList: {},
      selectedRowKeys: [],
      selectedRows: [],
      record: {},
      rowStyle: {},
      headerRowStyle: {},
      buttonStyle: {}
    }
  },
  filters: {
    levelFilter (type) {
      return screening.levelList[type].level
    },
    levelTitleFilter (type) {
      return screening.levelList[type].text
    },
    acStateTitleFilter (type) {
      switch (`${type}`) {
        case '0':
          return '新产生'
        case '5':
          return '已确认'
        case '10':
          return '已前转'
        case '20':
          return '已解决'
        case '30':
          return '已忽略'
        default:
          return type
      }
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
  created () {},
  methods: {
    /**
     * 加载表格数据
     * @param {Object} parameter CTable 回传的分页与排序条件
     */
    loadData (parameter) {
      // 清空选中
      this.selectedRowKeys = []
      const { resourceConfig } = this.elementProps.params
      if (resourceConfig) {
        return apollo.clients.alert.query({
          query,
          variables: {
            ...parameter,
            where: {
              ...this.where,
              state: {
                _eq: this.tabKey
              },
              arising_time: {
                _gte: '2018-5-31 00:00:00',
                _lte: '2018-5-31 23:59:59'
              },
              ...this.elementProps.domains ? {
                domains: {
                  _eq: resourceConfig.domains
                }
              } : {},
              ...this.elementProps.model ? {
                node_types: {
                  _eq: resourceConfig.model
                }
              } : {},
              ...this.elementProps.selectedInstance ? {
                node_ids: {
                  _in: resourceConfig.selectedInstance
                }
              } : {},
              ...this.elementProps.alarmType ? {
                alert_id: {
                  _in: resourceConfig.alarmType
                }
              } : {},
              ...this.elementProps.collectionSystem ? {
                agent_id: {
                  _in: resourceConfig.collectionSystem
                }
              } : {}
            }
          }
        }).then(r => r.data)
      }
    },
    eventQuery () {
      // return console.log(this.record)
      this.$refs.eventQuery.open(this.record)
    },
    /**
     * 获取现有的告警级别列表
     */
    getLevelList () {
      return apollo.clients.alert.query({
        query: levelQuery,
        variables: {
          state: this.tabKey,
          // arising_time: today(后期替换时间)
          arising_time_gte: '2018-5-31 00:00:00',
          arising_time_lte: '2018-5-31 23:59:59'
        }
      }).then(r => {
        this.alarmLevelList = {
          4: r.data.L5.aggregate.count,
          3: r.data.L4.aggregate.count,
          2: r.data.L3.aggregate.count,
          1: r.data.L2.aggregate.count,
          0: r.data.L1.aggregate.count
        }
      })
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 30s自动刷新
     */
    refresh (e) {
      if (e > 0) {
        this.autoRefresh = !this.autoRefresh
      }
      const refreshCycle = e * 60000
      if (this.autoRefresh) {
        this.timer = setInterval(() => {
          this.query()
          this.getLevelList()
        }, refreshCycle)
      } else {
        clearInterval(this.timer)
      }
    },
    /**
     * 点击添加消息提示音
     */
    onClickSound () {
      if (this.playAudio) {
        this.pauseAudio()
        this.playAudio = false
      } else {
        this.clickAudio()
        this.playAudio = true
      }
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
    onSearch (value) {
      console.log(value)
    },
    /**
     * 行属性,表格点击事件
     */
    customRow (record, index) {
      return {
        style: this.rowStyle,
        on: {
          dblclick: () => {
            this.record = record
            this.$refs.detail.open(record, 'monitorSee')
          }
        }
      }
    }
  },
  watch: {
    elementProps (props) {
      console.log(props)
      if (props.isCallInterface) {
        props.isCallInterface = false
        this.$refs['table'].refresh()
      }
      if (props.params.resourceConfig) {
        this.getLevelList()
      }
      if (props.params.refreshTime) {
        this.refresh(props.params.refreshTime)
      }
      this.headerRowStyle = props.styleConfig.header
      this.rowStyle = props.styleConfig.rows
      this.buttonStyle = props.styleConfig.button
      this.columns.forEach(e => {
        e.align = props.styleConfig.align
      })
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.timer)
    console.log('beforeDestroy')
  },
  destroyed () {
    // 清除定时器
    // clearInterval(this.timer)
    console.log('destroyed')
  }
}
</script>

<style scoped lang="less">
.alarm-list-element {
  padding: 24px;
}

.table-operator{
  button{
    margin-right:5px;
  }
}
.levelContent{
  display: inline-block;
  line-height: 14px;
  padding:10px;
  .levelIcon{
    display: inline-block;
    width: 18px;
    height: 14px;
    text-align: center;
    color: white;
    border-radius: 15%;
    font-size: 12px;
    font-weight: bold;
    margin-right: 5px;
  }
  .l1{
    background: #ff0000;
  }
  .l2{
    background: #f7870a;
  }
  .l3{
    background: #ffdb00;
  }
  .l4{
    background: #54b9e4;
  }
  .l5{
    background: #00c356;
  }
}
</style>
