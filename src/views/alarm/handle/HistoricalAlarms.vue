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
                <!-- <a-select
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
                </a-select> -->
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
            <a-col :md="advanced ? 12 : 8" :sm="24">
              <a-form-item label="CI类型">
                <a-select
                  allowClear
                  v-model="queryParam.node_types"
                  placeholder="请选择CI类型"
                  @change="ciTypeChange"
                >
                  <a-select-opt-group
                    v-for="(group,index) in queryList.typeList"
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
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item label="CI实例">
                  <a-select
                    allowClear
                    mode="multiple"
                    :maxTagCount="2"
                    v-model="queryParam.node_ids"
                    placeholder="请选择CI实例"
                    @change="CIInstanceChange"
                  >
                    <a-select-option value="checkall" key="checkall" >全选</a-select-option>
                    <a-select-opt-group
                      v-for="(group,index) in queryList.CIInstance"
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
              <a-col :md="12" :sm="24">
                <a-form-item label="告警类型">
                  <a-select
                    allowClear
                    mode="multiple"
                    :maxTagCount="2"
                    v-model="queryParam.alert_id"
                    placeholder="请选择告警类型"
                    @change="alarmTypeChange"
                  >
                    <a-select-option value="checkall" key="checkall" >全选</a-select-option>
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
                <a-form-item label="告警状态">
                  <a-select
                    allowClear
                    v-model="queryParam.state"
                    placeholder="请选择"
                    default-value=""
                  >
                    <a-select-option value="" key="" >所有</a-select-option>
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
                    default-value=""
                  >
                    <a-select-option value="" key="" >所有</a-select-option>
                    <a-select-option
                      v-for="item in alarmLevel"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="告警信息">
                  <a-input v-model="queryParam.message" placeholder="请输入"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="采集系统">
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
              <a-col :md="12" :sm="24">
                <a-form-item label="首次告警时间">
                  <a-date-picker showTime placeholder="Select Time" @change="onDataChange" @ok="onDataOk" />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="query">查询</a-button>
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
        <a-button @click="exportExcel(selectedRowKeys)" :disabled="!hasSelected">导出</a-button>
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
import queryList from '@/api/controller/AlarmqQueryList'
import { getHistoryEcxel } from '@/api/controller/ExcelExport'
import screening from '../screening'
import RollForward from '../modules/RollForward'
import MSolve from '../modules/MSolve'
import MDetail from '../modules/MDetail'

const query = gql`query instanceList($where: t_alert_bool_exp! = {}, $limit: Int! = 0, $offset: Int! = 10,  $orderBy: [t_alert_order_by!]) {
  pagination: t_alert_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: t_alert(offset: $offset, limit: $limit, order_by: $orderBy, where: $where) {
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
      queryList: {},
      // 筛选：告警状态
      alarmState: [
        {
          value: 0,
          label: '新产生'
        },
        {
          value: 5,
          label: '已确认'
        },
        {
          value: 10,
          label: '处理中'
        },
        {
          value: 20,
          label: '已处理'
        },
        {
          value: 30,
          label: '已忽略'
        }
      ],
      // 筛选：告警级别
      alarmLevel: [
        {
          value: 0,
          level: 'L1',
          text: 'INFO'
        },
        {
          value: 1,
          level: 'L2',
          text: 'WARNING'
        },
        {
          value: 2,
          level: 'L3',
          text: 'MINOR'
        },
        {
          value: 3,
          level: 'L4',
          text: 'MAJOR'
        },
        {
          value: 4,
          level: 'L5',
          text: 'CRITICAL'
        }
      ],
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
  created () {
    this.getqueryList()
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
     * 获取筛选项的下拉列表的值
     */
    async getqueryList () {
      this.queryList.domainList = await queryList.domainList()
      this.queryList.typeList = await queryList.typeList()
      this.queryList.alertList = await queryList.alertList()
      this.queryList.agentList = await queryList.agentList()
    },
    async ciTypeChange (value) {
      this.queryList.CIInstance = await queryList.nodeList(value)
    },
    query () {
      this.$refs['table'].refresh(true)
    },
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
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
    // 加载数据方法 必须为 Promise 对象
    loadData (parameter) {
      // 清空选中
      this.selectedRowKeys = []
      return apollo.clients.alert.query({
        query,
        variables: {
          ...parameter,
          where: {
            ...this.where,
            ...this.queryParam.domains ? {
              domains: {
                _eq: this.queryParam.domains
              }
            } : {},
            ...this.queryParam.node_types ? {
              node_types: {
                _eq: this.queryParam.node_types
              }
            } : {},
            ...this.queryParam.node_ids ? {
              node_ids: {
                _in: this.queryParam.node_ids
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
            } : {},
            ...this.queryParam.state ? {
              state: {
                _eq: this.queryParam.state
              }
            } : {},
            ...this.queryParam.severity ? {
              severity: {
                _eq: this.queryParam.severity
              }
            } : {},
            ...this.queryParam.message ? {
              message: {
                _ilike: this.queryParam.message
              }
            } : {}
          }
        }
      }).then(r => r.data)
    },
    /**
     * 行属性,表格点击事件
     */
    customRow (record, index) {
      return {
        on: {
          dblclick: () => {
            this.$refs.detail.open(record, 'historySee')
          }
        }
      }
    },
    /**
     * 导出
     */
    async  exportExcel (e) {
      const file = await getHistoryEcxel(e)
      this.downloadFile(file, '历史告警列表')
      // getHistoryEcxel(e).then(r => {
      //   const content = r.data
      //   const blob = new Blob([ content ])
      //   const fileName = `${new Date().getTime()}_历史告警导出.xlsx`
      //   if ('download' in document.createElement('a')) {
      //     const elink = document.createElement('a')
      //     elink.download = fileName
      //     elink.style.display = 'none'
      //     elink.href = URL.createObjectURL(blob)
      //     document.body.appendChild(elink)
      //     elink.click()
      //     URL.revokeObjectURL(elink.href)
      //     document.body.removeChild(elink)
      //   } else {
      //     navigator.msSaveBlob(blob, fileName)
      //   }
      // })
    },
    downloadFile (file, filename = '') {
      const blob = new Blob(
        [file],
        {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        })
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = filename // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement)// 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
    }
  }
}
</script>

<style scoped lang='less'>
</style>
