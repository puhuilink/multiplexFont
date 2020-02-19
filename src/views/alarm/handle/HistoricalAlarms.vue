/*
 * 历史告警
 */

<template>
  <div class="historical-alarms">
    <a-card :bordered="false">

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
                  placeholder="请选择"
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
                <a-form-item label="CI名称">
                  <a-select
                    mode="multiple"
                    allowClear
                    v-model="queryParam.CIName"
                    placeholder="请选择"
                    @change="CINameChange"
                  >
                    <a-select-option value="checkall" key="checkall" >全选</a-select-option>
                    <a-select-opt-group
                      v-for="(group,index) in CIName"
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
                    <a-select-option value="checkall" key="chackall" >全选</a-select-option>
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
              <a-col :md="12" :sm="24">
                <a-form-item label="告警状态">
                  <a-select
                    allowClear
                    v-model="queryParam.state"
                    placeholder="请选择"
                    default-value="checkall"
                  >
                    <a-select-option value="checkall" key="checkall" >所有</a-select-option>
                    <a-select-option
                      v-for="item in alarmState"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="告警级别">
                  <a-select
                    allowClear
                    v-model="queryParam.severity"
                    placeholder="请选择"
                    default-value="checkall"
                  >
                    <a-select-option value="checkall" key="checkall" >所有</a-select-option>
                    <a-select-option
                      v-for="item in alarmLevel"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="告警信息">
                  <a-input v-model="queryParam.messageFilter" placeholder="请输入"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="采集系统">
                  <a-select
                    allowClear
                    v-model="queryParam.alarmLevel"
                    placeholder="请选择"
                    default-value="checkall"
                  >
                    <a-select-option value="checkall" key="checkall" >所有</a-select-option>
                    <a-select-option
                      v-for="item in alarmLevel"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="首次告警时间">
                  <a-date-picker showTime placeholder="Select Time" @change="onDataChange" @ok="onDataOk" />
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
        <a-button @click="$refs.rollForward.open(selectedRowKeys, selectedRows)" :disabled="!hasSelected">前转</a-button>
        <a-button @click="$refs.resolve.open(selectedRowKeys)" :disabled="!hasSelected">解决</a-button>
        <a-button>导出</a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 列表 -->
      <CTable
        ref="table"
        rowKey="alert_id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x:3300, y: 350 }"
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
      <!-- E 列表 -->

      <!-- S model模块 -->
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
import RollForward from '../modules/RollForward'
import MSolve from '../modules/MSolve'
import MDetail from '../modules/MDetail'

export default {
  name: 'HistoricalAlarms',
  components: {
    CTable,
    Ellipsis,
    RollForward,
    MSolve,
    MDetail
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 筛选项：CI域
      CIDomain: screening.CIDomain,
      // 筛选项：CI类型
      CIType: screening.CIType,
      // 筛选项: CI名称
      CIName: screening.CIName,
      // 筛选项目：告警类型
      alarmType: screening.alarmType,
      // 筛选：告警状态
      alarmState: [
        {
          value: 'pending',
          label: '新产生'
        },
        {
          value: 'confirmed',
          label: '已确认'
        },
        {
          value: 'shifting',
          label: '处理中'
        },
        {
          value: 'resolved',
          label: '已处理'
        },
        {
          value: 'ignore',
          label: '已忽略'
        }
      ],
      // 筛选：告警级别
      alarmLevel: ['INFO', 'WARNING', 'MINOR', 'MAJOR', 'CRITCAL'],
      // 告警列表表头
      columns: [
        {
          title: '状态',
          dataIndex: 'state',
          width: 75,
          fixed: 'left',
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
          title: '级别',
          dataIndex: 'severity',
          width: 100,
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'level' }
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
          width: 180,
          sorter: true
        },
        {
          title: '最近告警时间',
          dataIndex: 'arising_time',
          width: 180,
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
          width: 200,
          sorter: true
        },
        {
          title: '关闭时间',
          dataIndex: 'close_time',
          width: 200,
          sorter: true
        },
        {
          title: '关闭人',
          dataIndex: 'close_by',
          width: 200,
          sorter: true
        },
        {
          title: '工单编号',
          dataIndex: 'order_id',
          width: 200,
          sorter: true
        },
        {
          title: '告警编号',
          dataIndex: 'alert_id',
          width: 200,
          sorter: true
        },
        {
          title: '子告警',
          dataIndex: 'related',
          width: 200,
          sorter: true
        },
        {
          title: '接入行',
          dataIndex: 'instance',
          width: 200,
          sorter: true
        },
        {
          title: '交易渠道',
          dataIndex: 'instance2',
          align: 'left',
          sorter: true
        }

      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const query = gql`query instanceList($limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_alert_order_by!]) {
          pagination: t_alert_aggregate(where: {}) {
            aggregate {
              count
            }
          }
          data: t_alert(offset: $offset, limit: $limit, order_by: $orderBy) {
            state
            dev_name
            app_name
            severity
            message
            first_arising_time
            arising_time
            count
            agent_id
            close_time
            close_by
            order_id
            alert_id
            related
            instance
            instance2
          }
        }`
        // 清空选中
        this.selectedRowKeys = []
        return apollo.clients.alert.query({
          query,
          variables: {
            ...parameter,
            ...this.queryParams
            // arising_time: today
          }
        }).then(r => r.data)
      },
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []

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
    /**
     * 返回表格选中行
     */
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
     * ci名称改变
     */
    CINameChange (value) {
      this.queryParam.CIName = screening.checkAll(value, this.CIName)
      console.log(this.queryParam)
    },
    /**
     * 告警类型改变
     */
    alarmTypeChange (value) {
      this.queryParam.alarmType = screening.checkAll(value, this.alarmType)
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
          },
          dblclick: () => {
            this.$refs.detail.open(record, 'historySee')
          }
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
</style>
