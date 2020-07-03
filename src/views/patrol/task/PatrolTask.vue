<template>
  <div class="PatrolTask">

    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      rowKey="task_id"
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
                  label="巡更区域"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-select allowClear v-model="queryParams.ascription">
                    <a-select-option
                      v-for="[code, name] in ascriptionList"
                      :key="code"
                    >{{ name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item
                  label="是否异常"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-select allowClear v-model="queryParams.is_enable" >
                    <a-select-option
                      v-for="[code, name] in enableList"
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
                    v-model="queryParams.task_status"
                    placeholder="请选择"
                    default-value=""
                  >
                    <a-select-option
                      v-for="[type, label] in statusList"
                      :key="type"
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
                  <a-range-picker class="fw" @change="doDateChange" />
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
        <a-button :disabled="!hasSelected" :loading="exportLoading" @click="exportExcel">导出</a-button>
      </template>

    </CTable>

    <TaskDetailSchema ref="schema" />
  </div>
</template>

<script>
import { getPatrolTaskExcel } from '@/api/controller/ExcelExport'
import { getTaskInfoList } from '@/api/controller/patrol'
import TaskDetailSchema from './modules/TaskDetailSchema'
import { List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import { downloadExcel } from '@/utils/util'
import {
  ascriptionList, enableList, statusList,
  ascriptionMapping, delayMapping, stateMapping, statusMapping
} from './typing'

export default {
  name: 'PatrolTask',
  mixins: [List],
  components: {
    TaskDetailSchema
  },
  data: () => ({
    ascriptionList,
    enableList,
    statusList,
    exportLoading: false,
    columns: Object.freeze([
      {
        title: '任务单号',
        dataIndex: 'task_id',
        width: 100,
        fixed: 'left',
        sorter: true
      },
      {
        title: '巡更区域',
        dataIndex: 'ascription',
        width: 120,
        customRender: ascription => ascriptionMapping.get(ascription)
      },
      {
        title: '计划名称',
        dataIndex: 'task_name',
        width: 150,
        sorter: true
      },
      // {
      //   title: '巡更组',
      //   dataIndex: 'plan_start_time',
      //   width: 180,
      //   sorter: true
      // },
      {
        title: '巡更实际开始时间',
        dataIndex: 'real_start_time',
        width: 180,
        sorter: true
      },
      {
        title: '巡更实际结束时间',
        dataIndex: 'real_end_time',
        width: 180,
        sorter: true
      },
      {
        title: '任务单状态',
        dataIndex: 'task_status',
        width: 120,
        sorter: true,
        customRender: status => statusMapping.get(status)
      },
      // TODO: 未知字段名
      {
        title: '异常',
        dataIndex: 'task_state',
        width: 80,
        sorter: true,
        customRender: state => stateMapping.get(state)
      },
      {
        title: '巡更人员',
        dataIndex: 'transactor_name',
        width: 150
      },
      {
        title: '延迟开始',
        dataIndex: 'is_delay',
        width: 120,
        sorter: true,
        customRender: isDelay => delayMapping.get(isDelay)
      }
    ])
  }),
  methods: {
    loadData (parameter) {
      return getTaskInfoList({
        ...parameter,
        where: {
          ...generateQuery(this.queryParams)
        }
      }).then(r => r.data)
    },
    /**
     * 巡更日期范围改变
     */
    doDateChange (date, dateStr) {
      this.queryParams.dateStr = dateStr
    },
    seeDetail () {
      // this.$refs.detail.open(this.selectedRows[0])
      const [id] = this.selectedRowKeys
      this.$refs['schema'].detail(id)
    },
    /**
     * 导出
     */
    async exportExcel () {
      try {
        this.exportLoading = true
        const content = await getPatrolTaskExcel(this.selectedRowKeys)
        downloadExcel('巡更记录单', content)
      } catch (e) {
        throw e
      } finally {
        this.exportLoading = false
      }
    }
  }
}
</script>

<style scoped lang='less'>
</style>
