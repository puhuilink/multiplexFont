/*
 * 历史告警
 * Author: yizhu liu
 * Date: 2019-12-19 13:58:55
 * Email: lyz02413@163.com
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
                    v-model="queryParam.alarmState"
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
                <a-form-item label="告警信息">
                  <a-input v-model="queryParam.alarmInfo" placeholder="请输入"/>
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
        <a-button @click="$refs.rollForward.open()" :disabled="!hasSelected">前转</a-button>
        <a-button @click="$refs.resolve.open()" :disabled="!hasSelected">解决</a-button>
        <a-button>导出</a-button>
      </div>
      <!-- E 操作栏 -->

      <!-- S 历史告警列表 -->
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x: 1300 }"
        :customRow="customRow"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        showPagination="auto"
      >
        <span slot="level" slot-scope="text">
          <a-badge
            :count="text | levelFilter"
            :title="text | levelTitleFilter"
            :numberStyle="text==0?{backgroundColor:'#ff0000'}:text==1?{backgroundColor:'#f7870a'}:
              text==2?{backgroundColor:'#ffdb00'}:text==3?{backgroundColor:'#54b9e4'}:
                text==4?{backgroundColor:'#00c356'}:{}"
          />
        </span>
        <span slot="activeState" slot-scope="text">
          <a-icon
            type="flag"
            theme="filled"
            :title="text | acStateTitleFilter"
            :style="text=='pending'?{color:'#c4c4c4', fontSize:'18px'}:text=='confirmed'?{color:'#00aaf', fontSize:'18px'}:
              text=='shifting'?{color:'#f99025', fontSize:'18px'}:text=='resolved'?{color:'#39cc39', fontSize:'18px'}:
                text=='ignore'?{color:'#000000', fontSize:'18px'}:{}"
          />
        </span>
        <span slot="message" slot-scope="text">
          <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
        </span>
      </s-table>
      <!-- E 历史告警列表 -->

      <!-- S model模块 -->
      <roll-forward ref="rollForward" @ok="() => $refs.table.refresh(true)"></roll-forward>
      <m-solve ref="resolve" @ok="() => $refs.table.refresh(true)"></m-solve>
      <!-- E model模块 -->
    </a-card>
  </div>
</template>
<script>
import { STable, Ellipsis } from '@/components'
import { getAlarmList } from '@/api/alarmMonitor'
import RollForward from '../modules/RollForward'
import MSolve from '../modules/MSolve'

const levelList = {
  0: {
    level: 'L5',
    text: 'CRITICAL'
  },
  1: {
    level: 'L4',
    text: 'MAJOR'
  },
  2: {
    level: 'L3',
    text: 'MINOR'
  },
  3: {
    level: 'L2',
    text: 'WARNING'
  },
  4: {
    level: 'L1',
    text: 'INFO'
  }
}
export default {
  name: 'HistoricalAlarms',
  components: {
    STable,
    Ellipsis,
    RollForward,
    MSolve
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 筛选项：CI域
      CIDomain: [
        {
          label: 'Root',
          options: [{
            value: 'rootDamin',
            label: 'rootDamin'
          }]
        }, {
          label: 'rootDamin',
          options: [{
            value: 'bj',
            label: '北京运维组'
          },
          {
            value: 'xm',
            label: '厦门运维组'
          }]
        }
      ],
      // 筛选项：CI类型
      CIType: [
        {
          label: 'Root',
          options: [{
            value: '0',
            label: '统一资源'
          }]
        },
        {
          label: 'CI',
          options: [{
            value: '1',
            label: '管理'
          },
          {
            value: '2',
            label: '监控定义'
          },
          {
            value: '3',
            label: '监控对象'
          },
          {
            value: '4',
            label: '告警'
          },
          {
            value: '5',
            label: '性能'
          }]
        },
        {
          label: 'Manager',
          options: [{
            value: '6',
            label: '字典数据'
          }]
        }
      ],
      // 筛选项: CI实例
      CIName: [
        {
          label: 'Root',
          options: [{
            value: '1',
            label: '统一资源'
          }]
        },
        {
          label: 'CI',
          options: [{
            value: '2',
            label: '管理'
          },
          {
            value: '3',
            label: '监控定义'
          },
          {
            value: '4',
            label: '监控对象'
          },
          {
            value: '5',
            label: '告警'
          },
          {
            value: '6',
            label: '性能'
          }]
        },
        {
          label: 'Manager',
          options: [{
            value: '7',
            label: '字典数据'
          }]
        }
      ],
      // 筛选项目：告警类型
      alarmType: [
        {
          label: 'Root',
          options: [{
            value: '1',
            label: '统一资源'
          }]
        },
        {
          label: 'CI',
          options: [{
            value: '2',
            label: '管理'
          },
          {
            value: '3',
            label: '监控定义'
          },
          {
            value: '4',
            label: '监控对象'
          },
          {
            value: '5',
            label: '告警'
          },
          {
            value: '6',
            label: '性能'
          }]
        },
        {
          label: 'Manager',
          options: [{
            value: '7',
            label: '字典数据'
          }]
        }
      ],
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
          dataIndex: 'activeState',
          sorter: true,
          width: 75,
          fixed: 'left',
          scopedSlots: { customRender: 'activeState' }
        },
        {
          title: 'CI名称',
          dataIndex: 'ciName',
          sorter: true
        },
        {
          title: '应用名称',
          dataIndex: 'appName',
          sorter: true
        },
        {
          title: '级别',
          dataIndex: 'level',
          sorter: true,
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '消息内容',
          dataIndex: 'message',
          scopedSlots: { customRender: 'message' }
        },
        {
          title: '首次告警时间',
          dataIndex: 'firstArisingTime',
          sorter: true
        },
        {
          title: '最近告警时间',
          dataIndex: 'arisingTime',
          sorter: true
        },
        {
          title: '次数',
          dataIndex: 'severity',
          sorter: true
        }

      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
      // 清空选中
        this.selectedRowKeys = []
        return getAlarmList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },
      // 已选行特性值
      selectedRowKeys: [],
      // 已选行数据
      selectedRows: []

    }
  },
  filters: {
    levelFilter (type) {
      return levelList[type].level
    },
    levelTitleFilter (type) {
      return levelList[type].text
    },
    acStateTitleFilter (type) {
      type += ''
      switch (type) {
        case 'pending':
          return '新产生'
        case 'confirmed':
          return '已确认'
        case 'shifting':
          return '已前转'
        case 'resolved':
          return '已解决'
        case 'ignore':
          return '已忽略'
        default:
          return ''
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
      this.queryParam.CIName = this.checkAll(value, this.CIName)
      console.log(this.queryParam)
    },
    /**
     * 告警类型改变
     */
    alarmTypeChange (value) {
      this.queryParam.alarmType = this.checkAll(value, this.alarmType)
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
          }
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.opration{
  margin-bottom: 10px;
  button{
    margin-right: 5px;
  }
}
</style>
