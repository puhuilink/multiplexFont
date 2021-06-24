<template>
  <div class="PatrolTask">

    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >

      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">

            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item
                  label="巡更组"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-select allowClear v-model="queryParams.group_id">
                    <a-select-option
                      v-for="{label, value} in groups"
                      :key="value"
                    >{{ label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item
                  label="是否异常"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-select allowClear v-model="queryParams.event_occur" >
                    <a-select-option
                      v-for="[code, name] in ENABLE_LIST"
                      :key="code"
                    >{{ name }}</a-select-option>
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
                    >{{ label }}</a-select-option>
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
                      最近1天: [moment().add(-1, 'days'), moment(), moment()],
                      最近1周: [moment().add(-7, 'days'), moment()],
                      最近1月: [moment().add(-30, 'days'), moment()],
                    }"
                    :showTime="{ format: 'HH:mm' }"
                    v-model="queryParams.actual_end_time"
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
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button :disabled="!hasSelectedOne" @click="seeDetail" >查看</a-button>
        <!-- <a-button :disabled="!hasSelected" :loading="exportLoading" @click="exportExcel">导出</a-button> -->
      </template>

    </CTable>

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

export default {
  name: 'PatrolTask',
  mixins: [List],
  components: {
    TaskDetailSchema
  },
  data: () => ({
    groups: [],
    ENABLE_LIST,
    ENABLE_LIST_MAPPING,
    STATUS_LIST,
    exportLoading: false,
    columns: Object.freeze([
      {
        title: '任务单号',
        dataIndex: 'id',
        width: 100,
        fixed: 'left',
        sorter: true
      },
      // {
      //   title: '巡更区域',
      //   dataIndex: 'zone { alias }',
      //   width: 120,
      //   customRender: (__, { zone: { alias } }) => alias
      //   // customRender: ascription => ASCRIPTION_MAPPING.get(ascription)
      // },
      {
        title: '计划名称',
        dataIndex: 'alias',
        width: 220,
        sorter: true
      },
      {
        title: '巡更组',
        dataIndex: 'group { group_name }',
        width: 220,
        sorter: true,
        customRender: (__, { group: { group_name } }) => group_name
      },
      {
        title: '巡更实际开始时间',
        dataIndex: 'actual_start_time',
        width: 180,
        sorter: true,
        customRender: actual_start_time => actual_start_time ? moment(actual_start_time).format('YYYY-MM-DD hh:mm:ss') : ''
      },
      {
        title: '延迟开始',
        dataIndex: 'actual_start_late',
        width: 120,
        sorter: true,
        customRender: actual_start_late => actual_start_late ? '是' : '否'
      },
      {
        title: '巡更实际结束时间',
        dataIndex: 'actual_end_time',
        width: 180,
        sorter: true,
        customRender: actual_end_time => actual_end_time ? moment(actual_end_time).format('YYYY-MM-DD hh:mm:ss') : ''
      },
      {
        title: '超时完成',
        dataIndex: 'actual_end_late',
        width: 120,
        sorter: true,
        // TODO: useMapping
        customRender: actual_end_late => actual_end_late ? '是' : '否'
      },
      {
        title: '任务单状态',
        dataIndex: 'status',
        width: 120,
        sorter: true,
        customRender: status => {
          console.log(status)
          return STATUS_MAPPING.get(status)
        }
      },
      {
        title: '存在异常',
        dataIndex: 'event_occur',
        width: 80,
        // TODO: useMapping
        customRender: eventOccur => eventOccur ? ENABLE_LIST_MAPPING.get(eventOccur) : '否'
      },
      {
        title: '巡更人员',
        dataIndex: 'executor',
        width: 150,
        customRender: executor => executor ? executor.slice(1, executor.length - 1) : ''
      }
    ])
  }),
  methods: {
    moment,
    async getGroup () {
      const { data: { GroupList } } = await GroupService.find({
        where: {
          is_patrol: { _eq: true }
        },
        fields: [
          'value: group_id',
          'label: group_name'
        ],
        alias: 'GroupList'
      })
      this.groups = GroupList
    },
    loadData (parameter) {
      const { status, ...rest } = this.queryParams
      return PatrolService.taskFind({
        where: {
          ...status ? { status: { _eq: status } } : {},
          ...generateQuery({ rest })
        },
        fields: this.columns.map(({ dataIndex }) => dataIndex),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    seeDetail () {
      const [id] = this.selectedRowKeys
      const [record] = this.selectedRows
      const status = parseInt(record.status)
      if (status < 30 && status > 2) {
        this.$refs['schema'].detail(id)
      } else {
        this.$message.error('该任务单没有巡更记录可查看！')
      }
    },
    /**
     * 导出
     */
    async exportExcel () {
      try {
        this.exportLoading = true
        const content = await PatrolService.getPatrolTaskExcel(this.selectedRowKeys)
        downloadExcel('巡更记录单', content)
      } catch (e) {
        throw e
      } finally {
        this.exportLoading = false
      }
    }
  },
  mounted () {
    this.getGroup()
  }
}
</script>

<style scoped lang='less'>
</style>
