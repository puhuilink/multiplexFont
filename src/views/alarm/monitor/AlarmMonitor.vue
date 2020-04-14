/**
 *告警监控
 */
<template>
  <div class="alarm-monitor">
    <a-card
      style="width:100%"
      :tabList="tabList"
      :activeTabKey="tabKey"
      @tabChange="tabKey => onTabChange(tabKey, 'key')"
    >
      <!-- S 列表 -->
      <CTable
        ref="table"
        rowKey="alert_id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x: 1800, y: 350 }"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >

        <template #query>
          <a-form layout="inline">
            <div :class="{ fold: !advanced }">
              <a-row >
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="CI域"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%"
                  >
                    <a-select
                      allowClear
                      v-model="queryParam.domains"
                      placeholder="请选择CI域"
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
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="CI类型"
                    :labelCol="{ span: 4 }"
                    :wrapperCol="{ span: 14, offset:2 }"
                    style="width: 100%"
                  >
                    <CiModelSelect
                      v-model="queryParam.model"
                      :value="queryParam.model"
                      @input="onModelInput"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <template v-if="advanced">
                  <a-col :md="12" :sm="24">
                    <a-form-item
                      label="CI实例"
                      :labelCol="{ span: 4 }"
                      :wrapperCol="{ span: 14, offset:2 }"
                      style="width: 100%"
                    >
                      <CiInstanceSelect
                        multiple
                        v-model="queryParam.node_id"
                        :parentNameS="queryParam.model"
                        :value="queryParam.node_id"
                        @input="onInstanceInput"
                      />
                    </a-form-item>
                  </a-col>
                  <!-- TODO: 告警类型来源不明 需要二次商议 -->
                  <a-col :md="12" :sm="24">
                    <a-form-item
                      label="告警类型"
                      :labelCol="{ span: 4 }"
                      :wrapperCol="{ span: 14, offset:2 }"
                      style="width: 100%"
                    >
                      <a-select
                        allowClear
                        mode="multiple"
                        :maxTagCount="2"
                        v-model="queryParam.alert_id"
                        placeholder="请选择告警类型"
                        @change="alarmTypeChange"
                      >
                        <!-- <a-select-option value="checkall" key="checkall" >全选</a-select-option> -->
                        <a-select-opt-group
                          v-for="(group,index) in queryList.alertList"
                          :key="index"
                          :label="group[0].parentname_s"
                          :allowClear="true"
                        >
                          <template v-for="groupitem in group">
                            <a-select-option :value="groupitem.id_s" :key="groupitem.id_s">{{ groupitem.label_s }}</a-select-option>
                          </template>
                        </a-select-opt-group>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :md="12" :sm="24">
                    <a-form-item
                      label="采集系统"
                      :labelCol="{ span: 4 }"
                      :wrapperCol="{ span: 14, offset:2 }"
                      style="width: 100%"
                    >
                      <a-select
                        allowClear
                        mode="multiple"
                        :maxTagCount="2"
                        v-model="queryParam.agent_id"
                        placeholder="请选择采集系统"
                        @change="agentChange"
                      >
                        <a-select-option value="checkall" key="checkall" >全选</a-select-option>
                        <a-select-opt-group
                          v-for="(group,index) in queryList.agentList"
                          :key="index"
                          :label="group[0].parentname_s"
                          :allowClear="true"
                        >
                          <template v-for="(groupitem,indexs) in group">
                            <a-select-option :value="groupitem.name_s" :key="indexs">{{ groupitem.label_s }}</a-select-option>
                          </template>
                        </a-select-opt-group>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </template>
              </a-row>
            </div>
            <span :style=" { float: 'right', overflow: 'hidden', transform: `translateY(${!advanced ? '6.5' : '15.5'}px)` } || {} ">
              <a-button type="primary" @click="query">查询</a-button>
              <a-button style="margin-left: 8px" @click="queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-form>
        </template>

        <template #operation >
          <a-row :style=" advanced?{ 'margin-top': '40px'}:{} ">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="{span: 8}"
              :xl="{span: 6}"
              class="table-operator">
              <a-button @click="$refs.confirm.open(selectedRowKeys)" :disabled="!selectedRowKeys.length > 0">确认</a-button>
              <a-button @click="$refs.rollForward.open(selectedRowKeys, selectedRows)" :disabled="!selectedRowKeys.length > 0">前转</a-button>
              <a-button @click="$refs.resolve.open(selectedRowKeys)" :disabled="!selectedRowKeys.length > 0">解决</a-button>
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="{span: 12}"
              :xl="{span: 9}"
              style="text-align: right;"
            >
              <a-input-search
                placeholder="输入关键字"
                style="width: 200px"
                @search="onSearch"
              />
              <a-icon style="padding:0px 15px;" type="setting" />
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
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="{span: 24}"
              :xl="{span: 9}"
              style="text-align: right;"
            >
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
      <!-- E 列表 -->

      <!-- S 表格右击菜单 -->
      <a-menu :style="menuStyle" v-if="menuVisible">
        <a-menu-item @click="$refs.confirm.open(selectedRowKeys)">
          <a-icon type="pushpin" />
          确认告警
        </a-menu-item>
        <a-menu-item @click="$refs.rollForward.open(selectedRowKeys, selectedRows)">
          <a-icon type="to-top" />
          前转告警
        </a-menu-item>
        <a-menu-item @click="$refs.resolve.open(selectedRowKeys)">
          <a-icon type="tool" />
          解决告警
        </a-menu-item>
      </a-menu>
      <!-- E 表格右击菜单 -->

      <!-- S model模块 -->
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
      <!-- E model模块 -->

    </a-card>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import queryList from '@/api/controller/AlarmqQueryList'
import screening from '../screening'
import MConfirm from '../modules/MConfirm'
import RollForward from '../modules/RollForward'
import MSolve from '../modules/MSolve'
import MDetail from '../modules/MDetail'
import EventQuery from '../modules/MEventQuery'
import Operation from '../modules/OperationLog'
import correlation from '../modules/MCorrelation'
import {
  CiModelSelect,
  CiInstanceSelect
} from '@/components/Common'

// 后期取消注释
// const today = screening.getNowFormatDate()
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
  name: 'AlarmMonitor',
  // props: {
  //   where: {
  //     type: Object,
  //     default: () => ({})
  //   }
  // },
  components: {
    CTable,
    Ellipsis,
    MConfirm,
    RollForward,
    MSolve,
    MDetail,
    EventQuery,
    Operation,
    correlation,
    CiModelSelect,
    CiInstanceSelect
  },
  data () {
    return {
      tabList: [
        {
          key: '0',
          tab: '待处理告警'
        },
        {
          key: '5',
          tab: '已确认告警'
        },
        {
          key: '10',
          tab: '已前转告警'
        },
        {
          key: '20',
          tab: '已解决告警'
        },
        {
          key: '30',
          tab: '已忽略告警'
        }
      ],
      tabKey: '0',
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      queryList: {},
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
      // 表格右击菜单数据
      menuVisible: false,
      menuStyle: {
        position: 'absolute',
        top: '0',
        left: '0',
        border: '1px solid #eee'
      },
      record: {}
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
  created () {
    this.getLevelList()
    this.getqueryList()
  },
  computed: {
  },
  methods: {
    /**
      * 加载表格数据
      * @param {Object} parameter CTable 回传的分页与排序条件
      * @return {Function: <Promise<Any>>}
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
            state: {
              _eq: this.tabKey
            },
            arising_time: {
              _gte: '2018-5-31 00:00:00',
              _lte: '2018-5-31 23:59:59'
            },
            ...this.queryParam.domains ? {
              domains: {
                _ilike: '/' + `%${this.queryParam.domains}$%` + '/'
              }
            } : {},
            ...this.queryParam.model ? {
              node_types: {
                _ilike: this.queryParam.model
              }
            } : {},
            ...this.queryParam.node_id ? {
              node_id: {
                _in: this.queryParam.node_id
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
            } : {}
          }
        }
      }).then(r => r.data)
    },
    eventQuery () {
      // return console.log(this.record)
      this.$refs.eventQuery.open(this.record)
    },
    onModelInput (str = '') {
      this.queryParam.model = str
      // 重置选中的 Ci 实例
      this.queryParam.node_id = []
    },
    onInstanceInput (arr = []) {
      // FIXME: 有时候抛出的 arr 是字符串？
      this.queryParam.node_id = Array.isArray(arr) ? arr : []
      // TODO: 重置 kpi ？
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
        const alarmMenuList = {
          0: r.data.m1.aggregate.count,
          1: r.data.m2.aggregate.count,
          2: r.data.m3.aggregate.count,
          3: r.data.m4.aggregate.count,
          4: r.data.m5.aggregate.count
        }
        for (const i in alarmMenuList) {
          const tabText = this.tabList[i].tab.substr(0, 5)
          this.tabList[i].tab = tabText + '（' + alarmMenuList[i] + '）'
        }
      })
    },
    /**
     * 获取筛选项的下拉列表的值
     */
    async getqueryList () {
      this.queryList.domainList = await queryList.domainList()
      this.queryList.alertList = await queryList.alertList()
      this.queryList.agentList = await queryList.agentList()
    },
    /**
     * tab切换开关
     */
    onTabChange (key, type) {
      this.tabKey = key
      this.autoRefresh = false
      clearInterval(this.timer)
      this[type] = key
      this.$refs['table'].refresh(true)
    },
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    async ciTypeChange (value) {
      this.queryList.CIInstance = await queryList.nodeList(value)
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
          this.getLevelList()
        }, 30000)
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
    /**
     * 点击隐藏表格小菜单
     */
    bodyClick () {
      this.menuVisible = false
      document.body.removeEventListener('click', this.bodyClick)
    },
    /**
     * ci实例改变
     */
    CIInstanceChange (value) {
      console.log(value)
      this.queryParam.CIInstance = screening.checkAll(value, this.queryList.CIInstance)
    },
    /**
     * 告警类型改变
     */
    alarmTypeChange (value) {
      this.queryParam.alert_id = screening.checkAll(value, this.queryList.alertList)
    },
    /**
     * 采集系统下拉改变
     */
    agentChange (value) {
      this.queryParam.agent_id = screening.checkAll(value, this.queryList.agentList)
    },
    onSearch (value) {
      console.log(value)
    },
    /**
     * 行属性,表格点击事件
     */
    customRow (record, index) {
      return {
        on: {
          contextmenu: e => {
            e.preventDefault()
            this.menuData = record
            this.menuVisible = true
            this.menuStyle.top = e.clientY - 80 + 'px'
            this.menuStyle.left = e.clientX - 250 + 'px'
            document.body.addEventListener('click', this.bodyClick)
          },
          dblclick: () => {
            this.record = record
            this.$refs.detail.open(record, 'monitorSee')
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
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
