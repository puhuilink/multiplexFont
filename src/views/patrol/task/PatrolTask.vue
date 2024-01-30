<template>
  <div class="PatrolTask">
    <!-- / 查询区域 -->
    <a-form layout="inline" class="form">
      <div :class="{ fold: true }">
        <a-row :gutter="[8,8]">
          <a-col :style="{ textAlign: 'left' }" class="search_box">
            <label class="search_label">搜索条件
              <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />
            </label>
            <span>
              <QueryBtn @click="query(true)" />
              <ResetBtn @click="resetQueryParams" />
            </span>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="工作组" v-bind="formItemLayout" class="fw">
              <a-select placeholder="请选择工作组" v-model="queryParams.groupId" style="width: 100%">
                <a-select-option v-for="(item ,index) in groupId_arr" :key="index" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item
              label="是否异常"
              v-bind="formItemLayout"
              class="fw"
            >
              <a-select allowClear v-model="queryParams.eventOccur">
                <a-select-option
                  v-for="[code, name] in ENABLE_LIST"
                  :key="code"
                >{{ name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="计划名称" v-bind="formItemLayout" class="fw">
              <a-input placeholder="请输入计划名称" v-model="queryParams.alias" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-show="advanced">
          <a-col :md="6" :sm="24">
            <a-form-item
              label="任务单状态"
              v-bind="formItemLayout"
              class="fw"
            >
              <a-select
                allowClear
                v-model="queryParams.status"
                placeholder="请选择"
                default-value=""
              >
                <a-select-option
                  v-for="[type, label] in STATUS_LIST"
                  :key="type"
                  :value="type"
                >{{ label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item
              label="巡更日期范围"
              v-bind="formItemLayout"
              class="fw"
            >
              <a-range-picker
                allowClear
                class="fw"
                format="YYYY-MM-DD HH:mm"
                :placeholder="['开始时间', '结束时间']"
                :ranges="{
                  '最近1天': [moment().add(-1, 'days'), moment(), moment()],
                  '最近1周': [moment().add(-7, 'days'), moment()],
                  '最近1月': [moment().add(-30, 'days'), moment()],
                }"
                :showTime="{ format: 'HH:mm' }"
                v-model="queryParams.timeList"
              />
            </a-form-item>
          </a-col>

        </a-row>
      </div>

      <!-- <span :class="advanced ? 'expand' : 'collapse'">
        <QueryBtn @click="query" />
        <ResetBtn @click="resetQueryParams" />
        <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />
      </span> -->
    </a-form>

    <!-- / 操作区域 -->
    <div class="operation_box">
      <a-button
        :type="hasSelectedOne ? 'primary' : ''"
        :disabled="!hasSelectedOne"
        @click="seeDetail"
        style="marginRight: 10px;"
        v-action:F010005001>
        <a-icon type="search" />
        查看
      </a-button>
      <a-button
        :loading="exportLoading"
        :disabled="!hasSelected"
        @click="exportExcel"
        style="marginRight: 10px;"
        v-action:F010005002>
        <a-icon type="upload" />
        导出
      </a-button>
      <a-button v-show="false" :loading="exportLoading" @click="exportExcelOnYear" v-action:F010005002>
        <a-icon type="upload" />
        导出月/年计划
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :dataSource="defaultData"
      ref="table"
      rowKey="id"
      :pagination="paginationOpt"
      :rowSelection="rowSelection"
      :scroll="{x:1500}"
      :rowClassName="(record, index) => index % 2 === 1 ? 'table_bg' : ''"
    >
      <template #action="text,record">
        <a @click="abnormalDate(record)" v-if="record.eventCount>0">
          <a-icon type="search" />
          {{ record.eventCount }}</a>
        <span v-else>
        </span>
      </template>
    </a-table>

    <TaskDetailSchema ref="schema" />
    <exportSchema ref="exportSchema"></exportSchema>
    <exportOnYearSchema ref="exportOnYearSchema" :plan="plans"></exportOnYearSchema>
  </div>
</template>

<script>
import TaskDetailSchema from './modules/TaskDetailSchema'
import { List } from '@/components/Mixins'
import exportSchema from './modules/exportSchema'
import exportOnYearSchema from './modules/exportOnYearSchema'
import {
  ENABLE_LIST, STATUS_LIST,
  STATUS_MAPPING, ENABLE_LIST_MAPPING
} from '../typing'
import moment from 'moment'
import { PatrolTaskListService } from '@/api/service/PatrolTaskListService'
import _ from 'lodash'
import { axios, xungeng } from '@/utils/request'

export default {
  name: 'PatrolTask',
  mixins: [List],
  components: {
    TaskDetailSchema,
    exportSchema,
    exportOnYearSchema
  },
  data () {
    return {
      groupId_arr: [],
      defaultData: [],
      groups: [],
      plans: [],
      ENABLE_LIST,
      ENABLE_LIST_MAPPING,
      STATUS_LIST,
      exportLoading: false,
      columns: Object.freeze([
        {
          title: '任务单号',
          dataIndex: 'id',
          width: 150,
          fixed: 'left',
          align: 'center'
          // sorter: (a, b) => Number(a.id) - Number(b.id),
          // defaultSortOrder: 'descend'
        },
        {
          title: '计划名称',
          dataIndex: 'planAlias',
          width: 220
        },
        {
          title: '工作组',
          dataIndex: 'groupName',
          width: 220,
          align: 'center'
        },
        {
          title: '巡更实际开始时间',
          dataIndex: 'actualStartTime',
          width: 180,
          // defaultSortOrder: 'descend',
          customRender: actual_start_time => actual_start_time ? moment(actual_start_time).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        {
          title: '延迟开始',
          dataIndex: 'actualStartLate',
          width: 100,
          align: 'center',
          customRender: actual_start_late => actual_start_late ? '是' : '否'
        },
        {
          title: '巡更实际结束时间',
          dataIndex: 'actualEndTime',
          width: 180,
          align: 'center',
          customRender: actual_end_time => actual_end_time ? moment(actual_end_time).format('YYYY-MM-DD HH:mm:ss') : ''
        },
        // {
        //   title: '超时完成',
        //   dataIndex: 'actualStartLate',
        //   width: 120,
        //   customRender: actual_end_late => actual_end_late ? '是' : '否'
        // },
        {
          title: '任务单状态',
          dataIndex: 'status',
          width: 120,
          align: 'center',
          customRender: status => {
            return STATUS_MAPPING.get(status)
          }
        },
        {
          title: '异常数量',
          // dataIndex: 'eventCount',
          width: 100,
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '巡更人员',
          dataIndex: 'executor',
          align: 'center',
          width: 150,
          customRender: (executor) => {
            if (!executor) {
              return ''
            } else if (executor.toString().includes('[')) {
              return executor.toString().slice(1, executor.length - 1)
            } else {
              return JSON.parse(executor.toString()).executor
            }
          }
        }
      ]),
      queryParams: {
        groupId: '',
        status: '',
        eventOccur: null,
        actualTimeStart: '',
        actualTimeEnd: ''
      },
      paginationOpt: {
        defaultCurrent: 1, // 默认当前页数
        current: 1,
        defaultPageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
        onShowSizeChange: (current, pageSize) => {
          this.paginationOpt.current = current
          this.paginationOpt.defaultPageSize = pageSize
          this.query()
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOpt.current = current
          this.paginationOpt.defaultPageSize = size
          this.query()
        }
      }
    }
  },
  methods: {
    abnormalDate (record) {
      console.log(record)
      const status = parseInt(record.status)
      if (status < 30 && status > 2) {
        this.$refs['schema'].detail(record)
      } else {
        this.$message.error('该任务单没有巡更记录可查看！')
      }
    },
    resetQueryParams () {
      this.queryParams = {
        groupId: '',
        status: '',
        eventOccur: null,
        actualTimeStart: '',
        actualTimeEnd: ''
      }
    },
    query (first) {
      if (this.queryParams.timeList) {
        this.queryParams.actualTimeStart = moment(this.queryParams.timeList[0]).format('YYYY-MM-DD HH:mm:ss')
        this.queryParams.actualTimeEnd = moment(this.queryParams.timeList[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      if (first) {
        this.paginationOpt.current = 1
        this.$nextTick()
      }
      this.loadData(this.reloadParams({
        ..._.omit(this.queryParams, ['timeList']),
        pageNum: this.paginationOpt.current,
        pageSize: this.paginationOpt.defaultPageSize
      }))
      this.selectedRowKeys = []
    },
    moment,
    reloadParams (params) {
      const newObj = {}
      Object.keys(params).forEach(key => {
        if (params[key] !== '') {
          newObj[key] = params[key]
        }
      })
      return newObj
    },
    // 4.工作组列表
    async getGroup () {
      // const { list } = await PatrolTaskListService.getGroupList({ pageNum: 0, pageSize: 9999 })
      // this.groups = list
      // this.queryParams.groupId = list[0].id

      const pageNum = 1
      const pageSize = 9999
      const { data } = await axios.get('/group/list', { params: { pageNum: pageNum, pageSize: pageSize } })
      this.dataList = data.list
      // 请选择工作组赋选择项
      for (const item of data.business) {
        if (item.patrol === true) {
          for (const i of data.list) {
            if (item.groupId === i.id) {
              this.groupId_arr.push(i)
            }
          }
        }
      }
    },
    async getPlan () {
      const { data: { list } } = await xungeng.get('/plan/list', {
        params: {
          pageSize: 9999,
          pageNum: 1
        }
      })
      this.plans = list.map(el => ({ label: el.alias, value: el.id }))
    },
    async loadData (parameter) {
      const { list, total } = await PatrolTaskListService.getTaskList(parameter)
      this.defaultData = list
      this.paginationOpt.total = total
    },
    seeDetail () {
      const [record] = this.selectedRows
      const status = parseInt(record.status)
      if (status < 30 && status > 2) {
        this.$refs['schema'].detail(record)
      } else {
        this.$message.error('该任务单没有巡更记录可查看！')
      }
    },
    getFormatDate () {
      const date = new Date()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      const currentDate = date.getFullYear() + '-' + month + '-' + strDate +
        '_' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      return currentDate
    },
    /**
     * 导出
     */
    async exportExcel () {
      // try {
      //   this.exportLoading = true
      //   for (let i = 0; i < this.selectedRowKeys.length; i++) {
      //     const key = this.selectedRowKeys[i]
      //     const record = this.selectedRows[i]
      //     const content = await PatrolService.getPatrolTaskExcel(key)
      //     let suffix
      //     if (record.actual_end_time !== null) {
      //       suffix = record.actual_end_time.toString().replaceAll('T', '_')
      //     } else {
      //       suffix = this.getFormatDate()
      //     }
      //     if (content.byteLength > 0) {
      //       await downloadExcel('巡更记录单-' + suffix + '.xls', content)
      //     } else {
      //       throw Error('该任务单没有任务报告！无法导出！')
      //     }
      //   }
      //   this.$notification.success({
      //     message: '系统提示',
      //     description: '导出巡更记录单成功'
      //   })
      // } catch (e) {
      //   this.$notification.error({
      //     message: '系统提示',
      //     description: h => h('p', { domProps: { innerHTML: e.message } })
      //   })
      //   throw e
      // } finally {
      //   this.exportLoading = false
      // }
      this.$refs.exportSchema.onShow(this.selectedRowKeys, this.selectedRows)
    },
    /**
     * 导出月/年计划
     */
    exportExcelOnYear () {
      this.$refs.exportOnYearSchema.onShow()
    }
  },
  async mounted () {
    await this.getGroup()
    await this.getPlan()
    this.query()
    this.columns = this.columns.map(el => ({ ellipsis: true, ...el }))
  }
}
</script>

<style scoped lang="less">
</style>
