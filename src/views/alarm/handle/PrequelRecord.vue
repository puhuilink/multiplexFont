/*
 * 前转记录
 * Author: yizhu liu
 * Date: 2019-12-26 16:20:24
 * Email: lyz02413@163.com
 */
<template>
  <div class="prequel-record">
    <a-card :bordered="false">

      <!-- S 搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="advanced ? 12 : 8" :sm="24">
              <a-form-item label="故障类型">
                <a-input v-model="queryParam.faultType" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="advanced ? 12 : 8" :sm="24">
              <a-form-item label="故障名称">
                <a-input v-model="queryParam.faultName" placeholder=""/>
              </a-form-item>
            </a-col>
            <!-- 多余筛选框是否展示 -->
            <template v-if="advanced">
              <a-col :md="12" :sm="24">
                <a-form-item label="前转类型">
                  <a-select
                    allowClear
                    v-model="queryParam.forwardType"
                    placeholder="请选择"
                    default-value="checkall"
                  >
                    <a-select-option
                      v-for="item in forwardType"
                      :key="item"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="前转目标">
                  <a-input v-model="queryParam.faultName" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="开始时间">
                  <a-date-picker showTime placeholder="Select Begin Time" @change="onDataChange(begin)" @ok="onDataOk" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="结束时间">
                  <a-date-picker showTime placeholder="Select End Time" @change="onDataChange(end)" @ok="onDataOk" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="发送者">
                  <a-input v-model="queryParam.sender" placeholder=""/>
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

      <!-- S 历史告警列表 -->
      <s-table
        ref="table"
        size="small"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :alert="false"
        :scroll="{ x: 1300, y:400 }"
        :customRow="customRow"
        showPagination="auto"
      >
        <span slot="message" slot-scope="text">
          <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
        </span>
      </s-table>
      <!-- E 历史告警列表 -->

      <!-- S model模块 -->
      <!-- <roll-forward ref="rollForward" @ok="() => $refs.table.refresh(true)"></roll-forward> -->
      <!-- E model模块 -->
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
// import screening from '../screening'
import { getForwardRecordList } from '@/api/prequelRecord'
// import RollForward from '../modules/RollForward'

export default {
  name: 'PrequelRecord',
  components: {
    STable,
    Ellipsis
    // RollForward,
  },
  data () {
    return {
      // 搜索： 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      forwardType: [
        '运维系统', '邮件', '短信'
      ],
      // 告警列表表头
      columns: [
        {
          title: '前转编号',
          dataIndex: 'id',
          sorter: true,
          align: 'center',
          width: 100,
          fixed: 'left'
        },
        {
          title: '故障类型',
          dataIndex: 'faultType',
          align: 'center',
          width: 100,
          sorter: true
        },
        {
          title: '故障级别',
          dataIndex: 'faultLevel',
          align: 'center',
          width: 100,
          sorter: true
        },
        {
          title: '故障名称',
          dataIndex: 'faultName',
          align: 'center',
          width: 120,
          sorter: true
        },
        {
          title: '发送者',
          dataIndex: 'sender',
          align: 'center',
          width: 120,
          sorter: true
        },
        {
          title: '前转类型',
          dataIndex: 'forwardType',
          align: 'center',
          width: 120,
          sorter: true
        },
        {
          title: '前转目标',
          dataIndex: 'forwardTarget',
          align: 'center',
          width: 120,
          sorter: true
        },
        {
          title: '发送时间',
          dataIndex: 'firstArisingTime',
          align: 'center',
          width: 150,
          sorter: true
        },
        {
          title: '描述',
          dataIndex: 'message',
          align: 'center',
          width: 400,
          scopedSlots: { customRender: 'message' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // 清空选中
        // this.selectedRowKeys = []
        return getForwardRecordList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      }
    }
  },
  filters: {
  },
  computed: {
  },
  methods: {
    /**
     * 筛选展开开关
     */
    toggleAdvanced () {
      this.advanced = !this.advanced
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
