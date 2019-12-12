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
      :activeTabKey="key"
      @tabChange="key => onTabChange(key, 'key')"
    >

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
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
            <a-col :md="8" :sm="24">
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
              <a-col :md="8" :sm="24">
                <a-form-item label="CI实例">
                  <a-select
                    mode="multiple"
                    allowClear
                    v-model="queryParam.CIInstance"
                    placeholder="请选择CI实例"
                    @change="CIInstanceChange"
                  >
                    <a-select-option value="checkall" key="chackall" >全选</a-select-option>
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
              <a-col :md="8" :sm="24">
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
      <a-row type="flex" justify="space-between" style="margin-bottom: 20px;">
        <a-col :span="6" class="table-operator">
          <a-button >确认</a-button>
          <a-button >前转</a-button>
          <a-button >解决</a-button>
        </a-col>
        <a-col :span="14" :offset="4">
          <a-input-search
            placeholder="输入关键字"
            style="width: 200px"
            @search="onSearch"
          />
          <a-icon style="padding:0px 15px;" type="setting" />
          <a-icon style="padding:0px 12px;" type="sync" />
          <a-icon style="padding:0px 15px;" type="sound" />
          <!-- <div class="levelContent" v-for=" i in alarmLevelList" :key="i">
            <a-badge :numberStyle="{backgroundColor:'#ff0000'}" />
            <span>100</span>
          </div> -->
        </a-col>
      </a-row>
      <!-- E 操作 -->

      <!--S 告警监控列表  -->
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
                text==4?{backGroundColor:'#00c356'}:{}"
          />
        </span>
        <span slot="message" slot-scope="text">
          <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
        </span>
      </s-table>
      <!-- E 告警监控列表 -->
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getAlarmList, getAlarmMenuList, getAlarmLevelList } from '@/api/alarmMonitor'

const levelList = {
  0: {
    level: 'L1',
    text: 'INFO'
  },
  1: {
    level: 'L2',
    text: 'WARNING'
  },
  2: {
    level: 'L3',
    text: 'MINOR'
  },
  3: {
    level: 'L4',
    text: 'MAJOR'
  },
  4: {
    level: 'L5',
    text: 'CRITICAL'
  }
}
export default {
  name: 'AlarmMonitor',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      tabList: [
        {
          key: 'pending',
          tab: '待处理告警'
        },
        {
          key: 'confirmed',
          tab: '已确认告警'
        },
        {
          key: 'shifting',
          tab: '已前转告警'
        },
        {
          key: 'resolved',
          tab: '已解决告警'
        },
        {
          key: 'ignore',
          tab: '已忽略告警'
        }
      ],
      key: 'pending',
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
      CIInstance: [
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
      // 告警列表表头
      columns: [
        {
          title: '级别',
          dataIndex: 'level',
          width: 75,
          fixed: 'left',
          sorter: true,
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '状态',
          dataIndex: 'activeState',
          sorter: true
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
    }
  },
  created () {
    this.alarmLevelList()
    this.alarmMenuList()
  },
  methods: {
    /**
     * 获取现有的告警级别列表
     */
    alarmLevelList () {
      return getAlarmLevelList()
        .then(res => {
          console.log(res)
          // return res.result
        })
    },
    /**
     * 获取tab的告警数量列表
     */
    alarmMenuList () {
      return getAlarmMenuList()
        .then(res => {
          console.log(res)
        })
    },
    /**
     * tab切换开关
     */
    onTabChange (key, type) {
      console.log(key, type)
      this[type] = key
    },
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
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
          click: () => {
            console.log(record, index)
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
</style>
