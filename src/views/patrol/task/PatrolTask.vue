<template>
  <div class="PatrolTask">
    <!-- / 查询区域 -->
    <a-form layout="inline" class="form">
      <div :class="{ fold: !advanced }">

        <a-row>
          <a-col :md="12" :sm="24">
            <a-form-item
              label="巡更组"
              v-bind="formItemLayout"
              class="fw"
            >
              <a-select allowClear v-model="queryParams.groupId">
                <a-select-option
                  v-for="{name, id} in groups"
                  :key="id"
                >{{ name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="24">
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
        </a-row>

        <a-row v-show="advanced">
          <a-col :md="12" :sm="24">
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

          <a-col :md="12" :sm="24">
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
                v-model="queryParams.actualEndTime"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <span :class="advanced ? 'expand' : 'collapse'">
        <QueryBtn @click="query" />
        <ResetBtn @click="resetQueryParams" />
        <ToggleBtn @click="toggleAdvanced" :advanced="advanced" />
      </span>
    </a-form>

    <!-- / 操作区域 -->

    <a-button :disabled="!hasSelectedOne" @click="seeDetail">查看</a-button>
    <a-button disabled :loading="exportLoading" @click="exportExcel">导出</a-button>

    <a-table
      style="margin-top: 30px"
      :columns="columns"
      :dataSource="defaultData"
      ref="table"
      rowKey="id"
      :pagination="paginationOpt"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >
    </a-table>

    <TaskDetailSchema ref="schema" />
  </div>
</template>

<script>
import TaskDetailSchema from './modules/TaskDetailSchema'
import { List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import { downloadExcel } from '@/utils/util'
import {
  ENABLE_LIST, STATUS_LIST,
  STATUS_MAPPING, ENABLE_LIST_MAPPING
} from '../typing'
import { GroupService, PatrolService } from '@/api'
import moment from 'moment'
import { PatrolTaskListService } from '@/api/service/PatrolTaskListService'

export default {
  name: 'PatrolTask',
  mixins: [List],
  components: {
    TaskDetailSchema
  },
  data: () => ({
    defaultData: [],
    paginationOpt: {},
    groups: [],
    ENABLE_LIST,
    ENABLE_LIST_MAPPING,
    STATUS_LIST,
    exportLoading: false,
    columns: Object.freeze([
      {
        title: '任务单号',
        dataIndex: 'id',
        width: 150,
        fixed: 'left'
      },
      {
        title: '计划名称',
        dataIndex: 'planAlias',
        width: 220
      },
      {
        title: '巡更组',
        dataIndex: 'groupName',
        width: 220
      },
      {
        title: '巡更实际开始时间',
        dataIndex: 'actualStartTime',
        width: 180,
        defaultSortOrder: 'descend',
        customRender: actual_start_time => actual_start_time ? moment(actual_start_time).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      {
        title: '延迟开始',
        dataIndex: 'actualStartLate',
        width: 120,
        customRender: actual_start_late => actual_start_late ? '是' : '否'
      },
      {
        title: '巡更实际结束时间',
        dataIndex: 'actualEndTime',
        width: 180,
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
        customRender: status => {
          return STATUS_MAPPING.get(status)
        }
      },
      {
        title: '异常数量',
        dataIndex: 'eventCount',
        width: 80
      },
      {
        title: '巡更人员',
        dataIndex: 'executor',
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
    }
  }),
  methods: {
    resetQueryParams () {
      this.queryParams = {
        groupId: '',
        status: '',
        eventOccur: null,
        actualTimeStart: '',
        actualTimeEnd: ''
      }
    },
    query () {
      this.loadData({ ...this.reloadParams({ ...this.queryParams }), pageNum: this.paginationOpt.defaultCurrent, pageSize: this.paginationOpt.defaultPageSize })
    },
    moment,
    initialPagination () {
      this.paginationOpt = {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 10, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['1', '10', '20', '50', '100'],
        showTotal: (total, [start, end]) => `显示 ${start} ~ ${end} 条记录，共 ${total} 条记录`,
        onShowSizeChange: (current, pageSize) => {
          this.paginationOpt.defaultCurrent = current
          this.paginationOpt.defaultPageSize = pageSize
          this.query()
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOpt.defaultCurrent = current
          this.paginationOpt.defaultPageSize = size
          this.query()
        }
      }
    },
    reloadParams (params) {
      const newObj = {}
      Object.keys(params).forEach(key => {
        if (params[key]) {
          newObj[key] = params[key]
        }
      })
      return newObj
    },
    async getGroup () {
      const { list } = await PatrolTaskListService.getGroupList({ pageNum: 0, pageSize: 9999 })
      this.groups = list
      this.queryParams.groupId = list[0].id
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
      try {
        this.exportLoading = true
        for (let i = 0; i < this.selectedRowKeys.length; i++) {
          const key = this.selectedRowKeys[i]
          const record = this.selectedRows[i]
          const content = await PatrolService.getPatrolTaskExcel(key)
          let suffix
          if (record.actual_end_time !== null) {
            suffix = record.actual_end_time.toString().replaceAll('T', '_')
          } else {
            suffix = this.getFormatDate()
          }
          if (content.byteLength > 0) {
            await downloadExcel('巡更记录单-' + suffix + '.xls', content)
          } else {
            throw Error('该任务单没有任务报告！无法导出！')
          }
        }
        this.$notification.success({
          message: '系统提示',
          description: '导出巡更记录单成功'
        })
      } catch (e) {
        this.$notification.error({
          message: '系统提示',
          description: h => h('p', { domProps: { innerHTML: e.message } })
        })
        throw e
      } finally {
        this.exportLoading = false
      }
    }
  },
  async mounted () {
    this.initialPagination()
    await this.getGroup()
    this.query()
  }
}
</script>

<style scoped lang='less'>
</style>
