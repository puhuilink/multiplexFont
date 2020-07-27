<template>
  <div class="AlarmMonitor">
    <a-tabs :activeKey="tabIndex" @change="onTabChange">
      <a-tab-pane :key="0" tab="未解决"></a-tab-pane>
      <a-tab-pane :key="1" tab="已解决"></a-tab-pane>
    </a-tabs>

    <CTable
      :customRow="customRow"
      :columns="visibleColumns"
      :data="loadData"
      ref="table"
      resizeableTitle
      rowKey="id"
      :rowSelection="rowSelection"
      :scroll="scroll"
    >

      <!-- / 查询区域 -->
      <template #query>
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">

            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="数据域"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.user_id" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="监控设备"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="监控实例"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="告警级别"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.user_id" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="采集系统"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="开始结束时间"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
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
      <div class="operation" slot="operation">
        <a-button @click="onDetail" :disabled="!hasSelectedOne">查看</a-button>
        <a-button @click="onSolve" :disabled="!hasSelectedOne" v-show="tabIndex !== 1">解决</a-button>
        <a-popover title="表格列设置">
          <a-list slot="content" item-layout="horizontal" :data-source="columns">
            <a-list-item slot="renderItem" slot-scope="column">
              <a-list-item-meta>
                <a-checkbox slot="title" v-model="column.show">
                  {{ column.title }}
                </a-checkbox>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
          <a-icon type="setting" />
        </a-popover>
      </div>
    </CTable>

    <AlarmDetail
      ref="detail"
      @close="onDetailClose"
    />

    <AlarmSolve
      ref="solve"
      @solveSuccess="onSolveSuccess"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import { List } from '@/components/Mixins'
import { AlarmService } from '@/api-hasura/index'
import { generateQuery } from '@/utils/graphql'
import AlarmDetail from './modules/AlarmDetail'
import AlarmSolve from './modules/AlarmSolve'

export default {
  name: 'AlarmMonitor',
  mixins: [List],
  components: {
    AlarmDetail,
    AlarmSolve
  },
  props: {},
  data: () => ({
    tabIndex: 0,
    columns: [
      {
        title: '告警级别',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true,
        show: true
      },
      // {
      //   title: '数据域',
      //   dataIndex: 'alarm_level',
      //   width: 200,
      //   sorter: true,
      // show: true
      // },
      {
        title: '监控设备',
        dataIndex: 'host_id',
        width: 200,
        show: true
        // sorter: true
      },
      {
        title: '监控实例',
        dataIndex: 'metric_id',
        width: 200,
        show: true
        // sorter: true
      },
      {
        title: '检查项',
        dataIndex: 'endpoint_id',
        width: 200,
        show: true
        // sorter: true
      },
      // {
      //   title: '值',
      //   dataIndex: 'email',
      //   width: 200,
      //   sorter: true,
      // show: true
      // },
      // {
      //   title: '首次告警时间',
      //   dataIndex: 'email',
      //   width: 200,
      //   sorter: true,
      // show: true
      // },
      // {
      //   title: '最近告警时间',
      //   dataIndex: 'email',
      //   width: 200,
      //   sorter: true,
      // show: true
      // },
      // {
      //   title: '次数',
      //   dataIndex: 'email',
      //   width: 200,
      //   sorter: true,
      // show: true
      // },
      {
        title: '采集系统',
        dataIndex: 'agent_id',
        width: 200,
        sorter: true,
        show: true
      }
    ]
  }),
  computed: {
    visibleColumns () {
      return this.columns.filter(({ show }) => show)
    }
  },
  methods: {
    customRow ({ id, state }) {
      return {
        on: {
          dblclick: () => {
            state === 0 && this.$refs.solve.open(id)
          }
        }
      }
    },
    loadData (parameter) {
      return AlarmService.find({
        where: {
          ...generateQuery(this.queryParams),
          state: this.tabIndex
        },
        fields: _.uniq(['id', 'state', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    onDetail () {
      const [id] = this.selectedRowKeys
      this.$refs.detail.open(id)
    },
    onDetailClose (state) {
      state === 1 && this.onSolveSuccess()
    },
    onSolve (id) {
      const [defaultId] = this.selectedRowKeys
      this.$refs.solve.open(id || defaultId)
    },
    onSolveSuccess () {
      this.query(false)
    },
    onTabChange (tabIndex) {
      this.tabIndex = tabIndex
      this.query()
    }
  }
}
</script>

<style lang="less" scoped>
.operation {
  // TODO
  // display: flex;
  // width: calc(100% - 216px);
  // flex-direction: row;
}
</style>
