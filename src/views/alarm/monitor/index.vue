<template>
  <div class="AlarmMonitor">
    <a-tabs :activeKey="state" @change="onToggleState" v-if="showSolve">
      <a-tab-pane :key="ALARM_STATE.unSolved" tab="未解决"></a-tab-pane>
      <a-tab-pane :key="ALARM_STATE.solved" tab="已解决"></a-tab-pane>
    </a-tabs>

    <!-- / FIXME: resizeableTitle 失效 -->
    <CTable
      :customRow="customRow"
      :columns="visibleColumns"
      :data="loadData"
      ref="table"
      rowKey="id"
      resizeableTitle
      :rowSelection="rowSelection"
      :scroll="scroll"
      v-bind="cTableProps"
    >

      <!-- / 查询区域 -->
      <template #query v-if="showQuery">
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">

            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item
                  label="监控对象"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <CmdbHostSelect
                    :value.sync="queryParams.host_id"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item
                  label="监控实体"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <EndpointSelect
                    schema="cmdb"
                    :parentId="queryParams.host_id"
                    :value.sync="queryParams.endpoint_id"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item
                  label="检查项"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <MetricSelect
                    schema="cmdb"
                    :parentId="queryParams.endpoint_id"
                    :value.sync="queryParams.metric_id"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item
                  label="告警级别"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-select allowClear v-model.number="queryParams.alarm_level">
                    <a-select-option
                      v-for="level in [1, 2, 3, 4, 5]"
                      :key="level"
                      :value="level"
                    >{{ level }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row v-show="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item
                  label="采集系统"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.agent_id" />
                </a-form-item>
              </a-col>

              <a-col :md="12" :sm="24">
                <a-form-item
                  label="告警时间"
                  v-bind="fullFormItemLayout"
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
                      '最近1月': [moment().add(-30, 'days'), moment()]
                    }"
                    :showTime="{ format: 'HH:mm' }"
                    v-model="queryParams.receive_time"
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
      <div class="operation" slot="operation">
        <a-button
          v-bind="btnProps"
          @click="onDetail()"
          :disabled="!hasSelectedOne"
        >查看</a-button>

        <a-button
          v-bind="btnProps"
          v-if="showSolve"
          v-show="state !== ALARM_STATE.solved"
          @click="onSolve()"
          :disabled="!hasSelectedOne"
        >解决</a-button>

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
          <a-button icon="setting">显示设置</a-button>
        </a-popover>

      </div>
    </CTable>

    <AlarmDetail
      ref="detail"
      @close="onDetailClose"
    />

    <AlarmSolve
      v-if="showSolve"
      ref="solve"
      @solveSuccess="onSolveSuccess"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import { List } from '@/components/Mixins'
import { AlarmService } from '@/api'
import { formatTime, generateQuery } from '@/utils/graphql'
import AlarmDetail from '../modules/AlarmDetail'
import AlarmSolve from '../modules/AlarmSolve'
import {
  CmdbHostSelect
} from '@/components/Resource'
import moment from 'moment'
import EndpointSelect from '~~~/ResourceConfig/Endpoint'
import MetricSelect from '~~~/ResourceConfig/Metric'
import { ALARM_STATE } from '@/tables/alarm/enum'

export default {
  name: 'AlarmMonitor',
  mixins: [List],
  components: {
    AlarmDetail,
    AlarmSolve,
    CmdbHostSelect,
    EndpointSelect,
    MetricSelect
  },
  props: {
    cTableProps: {
      type: Object,
      default: () => ({})
    },
    columnAlign: {
      type: String,
      default: 'left'
    },
    btnProps: {
      type: Object,
      default: () => ({})
    },
    showQuery: {
      type: Boolean,
      default: true
    },
    showSolve: {
      type: Boolean,
      default: true
    },
    // 展示所有记录
    showAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ALARM_STATE,
      state: ALARM_STATE.unSolved,
      columns: [
        {
          title: '告警级别',
          dataIndex: 'alarm_level',
          width: 120,
          sorter: true,
          show: true
        },
        {
          title: '监控设备',
          dataIndex: 'host_id cmdbHost { alias }',
          width: 220,
          show: true,
          customRender: (text, record) => _.get(record, 'cmdbHost.alias', record.host_id)
        },
        {
          title: '监控实体',
          dataIndex: 'metric_id cmdbEndpoint { modelEndpoint { alias } }',
          width: 220,
          show: true,
          customRender: (text, record) => _.get(record, 'cmdbEndpoint.modelEndpoint.alias', record.metric_id)
        },
        {
          title: '检查项',
          dataIndex: 'endpoint_id cmdbMetric { modelMetric { alias } }',
          width: 220,
          show: true,
          customRender: (text, record) => _.get(record, 'cmdbMetric.modelMetric.alias', record.endpoint_id)
        },
        {
          title: '告警时间',
          dataIndex: 'receive_time',
          width: 180,
          show: true,
          sorter: true,
          customRender: formatTime
        },
        {
          title: '告警描述',
          dataIndex: 'detail',
          width: 100,
          show: true,
          customRender: (__, record) => <a-button type="link" onClick={() => this.onDetail(record.id)}>查看</a-button>
        },
        {
          title: '采集系统',
          dataIndex: 'agent_id',
          width: 100,
          sorter: true,
          show: true
        }
      ]
    }
  },
  computed: {
    scrollY () {
      return 'max(calc(100vh - 385px), 100px)'
    },
    visibleColumns () {
      const { columnAlign: align, columns } = this
      return columns
        .filter(({ show }) => show)
        .map((column) => Object.assign({}, column, { align }))
    }
  },
  methods: {
    moment,
    customRow ({ id, state }) {
      return {
        on: {
          dblclick: () => {
            state === ALARM_STATE.unSolved && this.$refs.solve.open(id)
          }
        }
      }
    },
    loadData (parameter) {
      return AlarmService.find({
        where: {
          ...generateQuery(this.queryParams),
          ...this.showAll ? {} : {
            state: this.state
          }
        },
        fields: _.uniq([
          'id',
          'state',
          ...this.columns.map(({ dataIndex }) => dataIndex)
        ]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    /**
     * 查看告警详情
     */
    onDetail (id) {
      const [defaultId] = this.selectedRowKeys
      this.$refs.detail.open(id || defaultId)
    },
    /**
     * 告警管理
     */
    onDetailClose (state) {
      state === ALARM_STATE.solved && this.onSolveSuccess()
    },
    /**
     * 关闭告警
     */
    onSolve () {
      const [record] = this.selectedRows
      this.$refs.solve.open(record)
    },
    /**
     * 关闭告警成功
     */
    onSolveSuccess () {
      this.query(false)
    },
    /**
     * 切换未解决/已解决
     */
    onToggleState (state) {
      this.state = state
      this.query()
    }
  }
}
</script>

<style lang="less">
</style>
