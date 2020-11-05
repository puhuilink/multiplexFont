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
                  label="巡更区域"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-select allowClear v-model="queryParams.ascription">
                    <a-select-option
                      v-for="[code, name] in ASCRIPTION_LIST"
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
                  <a-range-picker class="fw" />
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
import { getPatrolTaskExcel } from '@/api/controller/ExcelExport'
import TaskDetailSchema from './modules/TaskDetailSchema'
import { List } from '@/components/Mixins'
import { generateQuery } from '@/utils/graphql'
import { downloadExcel } from '@/utils/util'
import {
  ASCRIPTION_LIST, ENABLE_LIST, STATUS_LIST,
  STATUS_MAPPING
} from '../typing'
import { PatrolService } from '@/api-hasura'

export default {
  name: 'PatrolTask',
  mixins: [List],
  components: {
    TaskDetailSchema
  },
  data: () => ({
    ASCRIPTION_LIST,
    ENABLE_LIST,
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
      {
        title: '巡更区域',
        dataIndex: 'zone_id',
        width: 120
        // customRender: ascription => ASCRIPTION_MAPPING.get(ascription)
      },
      {
        title: '计划名称',
        dataIndex: 'alias',
        width: 220,
        sorter: true
      },
      {
        title: '巡更组',
        dataIndex: 'group_id',
        width: 220,
        sorter: true
      },
      {
        title: '巡更实际开始时间',
        dataIndex: 'actual_start_time',
        width: 180,
        sorter: true
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
        sorter: true
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
        customRender: status => STATUS_MAPPING.get(status)
      },
      {
        title: '存在异常',
        dataIndex: 'event_occur',
        width: 80,
        sorter: true,
        // TODO: useMapping
        customRender: eventOccur => eventOccur ? '是' : '否'
      },
      {
        title: '巡更人员',
        dataIndex: 'executor',
        width: 150
      }
    ])
  }),
  methods: {
    loadData (parameter) {
      return PatrolService.taskFind({
        where: {
          ...generateQuery(this.queryParams)
        },
        fields: this.columns.map(({ dataIndex }) => dataIndex),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
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
