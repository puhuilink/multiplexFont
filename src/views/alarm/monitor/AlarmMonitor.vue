/**
 *告警监控
 *Author: yizhu liu
 *Date: 2019-12-03 14:13:22
 *Email: lyz02413@163.com
 */
<template>
  <div class="alarm-monitor">
    <a-card
      style="width:100%"
      :tabList="tabList"
      :activeTabKey="tabKey"
      @tabChange="tabKey => onTabChange(tabKey, 'key')"
    >

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="advanced ? 12 : 8" :sm="24">
              <a-form-item label="CI域">
                <a-select
                  allowClear
                  v-model="queryParam.CIDomain"
                  placeholder="请选择CI域"
                >
                  <a-select-opt-group
                    v-for="(group,index) in CIDomain"
                    :key="index"
                    :label="group.label"
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
            <a-col :md="advanced ? 12 : 8" :sm="24">
              <a-form-item label="CI类型">
                <a-select
                  allowClear
                  v-model="queryParam.CIType"
                  placeholder="请选择CI类型"
                >
                  <a-select-opt-group
                    v-for="(group,index) in CIType"
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
              <a-col :md="12" :sm="24">
                <a-form-item label="CI实例">
                  <a-select
                    mode="multiple"
                    allowClear
                    v-model="queryParam.CIInstance"
                    placeholder="请选择CI实例"
                    @change="CIInstanceChange"
                  >
                    <a-select-option value="checkall" key="checkall" >全选</a-select-option>
                    <a-select-opt-group
                      v-for="(group,index) in CIInstance"
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
              <a-col :md="12" :sm="24">
                <a-form-item label="告警类型">
                  <a-select
                    mode="multiple"
                    allowClear
                    v-model="queryParam.alarmType"
                    placeholder="请选择告警类型"
                    @change="alarmTypeChange"
                  >
                    <a-select-option value="checkall" key="checkall" >全选</a-select-option>
                    <a-select-opt-group
                      v-for="(group,index) in alarmType"
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

      <!-- S 操作 -->
      <a-row type="flex" justify="space-between" >
        <a-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="4"
          :xl="10"
          class="table-operator">
          <a-button @click="$refs.confirm.open(record)" :disabled="selectedRowKeys.length > 0">确认</a-button>
          <a-button @click="$refs.rollForward.open()" :disabled="selectedRowKeys.length > 0">前转</a-button>
          <a-button @click="$refs.resolve.open()" :disabled="selectedRowKeys.length > 0">解决</a-button>
        </a-col>
        <a-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="20"
          :xl="14"
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
      <!-- E 操作 -->

      <!-- S 告警监控列表 -->
      <CTable
        ref="table"
        size="small"
        rowKey="alert_id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x: 1800, y: 350 }"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
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
      <!-- E 告警监控列表 -->

      <!-- S 表格右击菜单 -->
      <a-menu :style="menuStyle" v-if="menuVisible">
        <a-menu-item @click="$refs.confirm.open()">
          <a-icon type="pushpin" />
          确认告警
        </a-menu-item>
        <a-menu-item @click="$refs.rollForward.open()">
          <a-icon type="to-top" />
          前转告警
        </a-menu-item>
        <a-menu-item @click="$refs.resolve.open()">
          <a-icon type="tool" />
          解决告警
        </a-menu-item>
      </a-menu>
      <!-- E 表格右击菜单 -->

      <!-- S model模块 -->
      <m-confirm ref="confirm" @ok="() => $refs.table.refresh(true)"></m-confirm>
      <roll-forward ref="rollForward" @ok="() => $refs.table.refresh(true)"></roll-forward>
      <m-solve ref="resolve" @ok="() => $refs.table.refresh(true)"></m-solve>
      <m-detail ref="detail"></m-detail>
      <!-- E model模块 -->

    </a-card>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import CTable from '@/components/Table/CTable'
import gql from 'graphql-tag'
import apollo from '@/utils/apollo'
import screening from '../screening'
import MConfirm from '../modules/MConfirm'
import RollForward from '../modules/RollForward'
import MSolve from '../modules/MSolve'
import MDetail from '../modules/MDetail'

const query = gql`query instanceList($state: numeric!, $limit: Int! = 0, $offset: Int! = 10, $orderBy: [t_alert_order_by!]) {
  pagination: t_alert_aggregate(where: {state: {_eq: $state}}) {
    aggregate {
      count
    }
  }
  data: t_alert(offset: $offset, limit: $limit, where: {state: {_eq: $state}}, order_by: $orderBy) {
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
  }
}`
const levelQuery = gql`query($state: numeric! ) {
  L1: t_alert_aggregate(where: {state:{_eq: $state},severity:{_eq:0}}) {
    aggregate {
      count
    }
  }
  L2: t_alert_aggregate(where: {state:{_eq: $state},severity:{_eq:1}}) {
    aggregate {
      count
    }
  }
  L3:t_alert_aggregate(where: {state:{_eq: $state},severity:{_eq:2}}) {
    aggregate {
      count
    }
  }
  L4:t_alert_aggregate(where: {state:{_eq: $state},severity:{_eq:3}}) {
    aggregate {
      count
    }
  }
  L5:t_alert_aggregate(where: {state:{_eq: $state},severity:{_eq:4}}) {
    aggregate {
      count
    }
  }
}`
const menuQuery = gql`query{
  m1: t_alert_aggregate(where: {state: {_eq: 0}}) {
    aggregate {
      count
    }
  }
  m2: t_alert_aggregate(where: {state: {_eq: 5}}) {
    aggregate {
      count
    }
  }
  m3: t_alert_aggregate(where: {state: {_eq: 10}}) {
    aggregate {
      count
    }
  }
  m4: t_alert_aggregate(where: {state: {_eq: 20}}) {
    aggregate {
      count
    }
  }
  m5: t_alert_aggregate(where: {state: {_eq: 30}}) {
    aggregate {
      count
    }
  }
}`

export default {
  name: 'AlarmMonitor',
  components: {
    CTable,
    Ellipsis,
    MConfirm,
    RollForward,
    MSolve,
    MDetail
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
      // 筛选项：CI域
      CIDomain: screening.CIDomain,
      // 筛选项：CI类型
      CIType: screening.CIType,
      // 筛选项: CI实例
      CIInstance: screening.CIInstance,
      // 筛选项：告警类型
      alarmType: screening.alarmType,
      // 自动刷新
      autoRefresh: false,
      // 是否播放告警音频
      playAudio: false,
      // 告警列表表头
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
      /**
        * 加载表格数据
        * @param {Object} parameter CTable 回传的分页与排序条件
        * @return {Function: <Promise<Any>>}
       */
      loadData: parameter => {
        // 清空选中
        this.selectedRowKeys = []
        return apollo.clients.alert.query({
          query,
          variables: {
            ...parameter,
            ...this.queryParams,
            state: this.tabKey
          }
        }).then(r => r.data)
      },
      // 自动刷新的定时器
      timer: null,
      // 告警级别数据对象
      alarmLevelList: {},
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: [],
      // 表格右击菜单数据
      menuVisible: false,
      menuStyle: {
        position: 'absolute',
        top: '0',
        left: '0',
        border: '1px solid #eee'
      }
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
    this.getMenuList()
  },
  computed: {
  },
  methods: {
    /**
     * 获取现有的告警级别列表
     */
    getLevelList () {
      const that = this
      return apollo.clients.alert.query({
        query: levelQuery,
        variables: {
          state: this.tabKey
        }
      }).then(r => {
        that.alarmLevelList = {
          4: r.data.L5.aggregate.count,
          3: r.data.L4.aggregate.count,
          2: r.data.L3.aggregate.count,
          1: r.data.L2.aggregate.count,
          0: r.data.L1.aggregate.count
        }
      })
    },
    /**
     * 获取tab的告警数量列表
     */
    getMenuList () {
      return apollo.clients.alert.query({
        query: menuQuery
      }).then(r => {
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
     * tab切换开关
     */
    onTabChange (key, type) {
      this.tabKey = key
      console.log(key, type)
      this.autoRefresh = false
      clearInterval(this.timer)
      this[type] = key
      this.$refs.table.refresh(true)
    },
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
     * 30s自动刷新
     */
    refresh () {
      this.autoRefresh = !this.autoRefresh
      if (this.autoRefresh) {
        this.timer = setInterval(() => {
          this.$refs.table.refresh(true)
          this.getLevelList()
          this.getMenuList()
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
      this.queryParam.CIInstance = this.checkAll(value, this.CIInstance)
      console.log(this.queryParam)
    },
    /**
     * 选择框全选(适用于分组选择器)
     */
    checkAll (arr, modelList) {
      // arr:change中的数组 ，  modelList:下拉框List
      const length = arr.length
      let list = arr
      arr.forEach(element => {
        // 当数组中存在0，说明此时进行全选/取消全选
        if (element === 'checkall') {
          // 当数组长度为最大长度且最后一个元素为0时，说明此时在全选的基础上又点击全选，则取消全选
          if (length - 1 === modelList.length && arr[length - 1] === 'checkall') {
            list = []
          } else {
            // 当不是取消全选操作，只要数组中出现了0则说明进行了全选操作
            list = []
            modelList.forEach(m => {
              for (const i in m.options) {
                list.push(m.options[i].value)
              }
            })
          }
        }
      })
      return list
    },
    /**
     * 告警类型改变
     */
    alarmTypeChange (value) {
      this.queryParam.alarmType = this.checkAll(value, this.alarmType)
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
  display: inline;
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
// BEM: block + element + modify
.AlarmMonitor {
  &-level {
    &__01 {}
    &__02 {}
  }
}
</style>
