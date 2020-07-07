<template>
  <div class="AlarmApprove">
    <div class="user">
      <CTable
        :columns="columns"
        :data="loadData"
        ref="table"
        rowKey="id"
        :rowSelection="null"
        :scroll="scroll"
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
          <a-button @click="onApprove" :disabled="!hasSelectedOne">审批</a-button>
        </template>

        <!-- / 子表：告警条目 -->
        <template v-slot:expandedRowRender="{ id }">
          <EventList :taskId="id" />
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
        dataIndex: 'zone_id',
        sorter: true,
        width: 180
      },
      {
        title: '计划名称',
        dataIndex: 'alias',
        sorter: true,
        width: 180
      },
      {
        title: '巡更组',
        dataIndex: 'group_id',
        sorter: true,
        width: 180
      },
      {
        title: '告警提交时间',
        dataIndex: 'create_time',
        sorter: true,
        width: 180
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
        sorter: true,
        width: 180,
        customRender: (_events, { events }) => events.length
      }
    ])
  }),
  computed: {
    subScroll () {
      return {
        x: _.sum(this.subColumns.map(e => e.width || 60)),
        y: 200
      }
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
      const [record] = this.selectedRowKeys
      this.$refs['schema'].approve(record)
    }
  }
}
</script>

<style lang="less">

</style>
