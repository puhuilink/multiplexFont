<template>
  <div class="AlarmApprove">
    <div class="user">
      <CTable
        :columns="columns"
        :data="loadData"
        ref="table"
        rowKey="id"
        :rowSelection="null"
        @expand="onExpandSubTable"
      >

        <!-- / 操作区域 -->
        <template #query>
          <a-form layout="inline" class="form">
            <div :class="{ fold: !advanced }">
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item
                    label="交接人员姓名"
                    v-bind="formItemLayout"
                    class="fw"
                  >
                    <a-input allowClear v-model.trim="queryParams.user_id" />
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
          <a-button @click="onApprove" :disabled="!hasSelectedOneTask">审批</a-button>
        </template>

        <!-- / 子表：告警条目 -->
        <template v-slot:expandedRowRender="{ id, hasExpanded }">
          <EventList :taskId="id" v-if="hasExpanded" @selectSubRow="onSelectSubRow" />
        </template>

      </CTable>

      <ApproveSchema
        ref="schema"
      />

    </div>
  </div>
</template>

<script>
import { PatrolService } from '@/api-hasura'
import { generateQuery } from '@/utils/graphql'
import { Confirm, List } from '@/components/Mixins'
import _ from 'lodash'
import ApproveSchema from './modules/ApproveSchema/index'
import EventList from './modules/EventList'
import moment from 'moment'

export default {
  name: 'AlarmApprove',
  mixins: [Confirm, List],
  props: {},
  components: {
    ApproveSchema,
    EventList
  },
  data: () => ({
    columns: Object.freeze([
      {
        title: '任务单号',
        dataIndex: 'id',
        sorter: true,
        width: 180
      },
      {
        title: '巡更区域',
        dataIndex: 'zone { alias }',
        sorter: true,
        customRender: (__, { zone }) => _.get(zone, 'alias')
      },
      {
        title: '计划名称',
        dataIndex: 'alias',
        sorter: true,
        width: 180
      },
      {
        title: '巡更组',
        dataIndex: 'group { group_name }',
        width: 180,
        customRender: (__, { group }) => _.get(group, 'group_name')
      },
      {
        title: '告警提交时间',
        dataIndex: 'create_time',
        sorter: true,
        width: 180,
        customRender: createTime => moment(createTime).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '审批状态',
        dataIndex: 'review',
        sorter: true,
        width: 180
      },
      {
        title: '巡更人员',
        dataIndex: 'executor',
        sorter: true,
        width: 180
      },
      {
        title: '异常数量',
        dataIndex: 'events { id }',
        width: 180,
        customRender: (_events, { events }) => events.length
      }
    ]),
    selectedEvents: {}
  }),
  computed: {
    selectedTaskList () {
      return Object
        .entries(this.selectedEvents)
        .filter(([taskId, selectedEvents]) => selectedEvents.length)
    },
    // 一次只允许审批一个任务单下的多条告警
    hasSelectedOneTask () {
      return this.selectedTaskList.length === 1
    }
  },
  methods: {
    loadData (parameter) {
      return PatrolService.eventTaskFind({
        where: {
          ...generateQuery(this.queryParams)
        },
        fields: _.uniq([ 'id', ...this.columns.map(({ dataIndex }) => dataIndex) ]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    onApprove () {
      const [selectedTask] = this.selectedTaskList
      const [, events] = selectedTask
      this.$refs['schema'].approve(events)
    },
    onExpandSubTable (expand, record) {
      if (expand) {
        record.hasExpanded = true
      }
    },
    onSelectSubRow ({ selectedRows = [], taskId }) {
      if (_.isEmpty(selectedRows)) {
        this.$delete(this.selectedEvents, `${taskId}`)
      } else {
        this.$set(this.selectedEvents, `${taskId}`, selectedRows)
      }
    }
  }
}
</script>

<style lang="less">

</style>
