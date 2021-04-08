<template>
  <div class="AlarmMonitor">
    <a-tabs :activeKey="state" @change="onToggleState" v-if="showSolve">
      <a-tab-pane :key="ALARM_STATE.unSolved" tab="未解决"></a-tab-pane>
      <a-tab-pane :key="ALARM_STATE.solved" tab="已解决"></a-tab-pane>
    </a-tabs>

    <!-- / FIXME: resizeableTitle 失效 -->
    <!-- resizeableTitle -->
    <CTable
      bordered
      :customRow="customRow"
      :columns="visibleColumns"
      :data="loadData"
      ref="table"
      rowKey="id"
      :rowSelection="rowSelection"
      :scroll="scroll"
      v-bind="cTableProps"
    >
      <!-- / 查询区域 -->
      <template #query v-if="showQuery">
        <a-form layout="inline" class="form">
          <div :class="{ fold: !advanced }">
            <a-row>
              <a-col :xl="8" :md="12" :sm="24">
                <a-form-item label="品牌设备" v-bind="formItemLayout" class="fw">
                  <CascaderDictValue :value="queryParams.dictValue" @change="onChangDictValue" />
                </a-form-item>
              </a-col>

              <a-col :xl="8" :md="12" :sm="24">
                <a-form-item label="监控对象" v-bind="formItemLayout" class="fw">
                  <HostSelect
                    :hostTypeDictValueCode="hostTypeDictValueCode"
                    :value="queryParams.host_id"
                    @update:value="onChangeHostId($event)"
                  />
                </a-form-item>
              </a-col>

              <a-col :xl="8" :md="12" :sm="24">
                <a-form-item label="监控实体" v-bind="formItemLayout" class="fw">
                  <EndpointSelect
                    schema="cmdb"
                    :parentId="queryParams.host_id"
                    :value="queryParams.endpoint_id"
                    @update:value="onChangeEndpointId($event)"
                  />
                </a-form-item>
              </a-col>

              <a-col :xl="8" :md="12" :sm="24">
                <a-form-item label="检查项" v-bind="formItemLayout" class="fw">
                  <MetricSelect
                    schema="cmdb"
                    :parentId="queryParams.endpoint_id"
                    :value="queryParams.metric_id"
                    @update:value="onChangeMetricId($event)"
                  />
                </a-form-item>
              </a-col>

              <a-col :xl="8" :md="12" :sm="24">
                <a-form-item label="采集系统" v-bind="formItemLayout" class="fw">
                  <a-input allowClear v-model.trim="queryParams.agent_id" />
                </a-form-item>
              </a-col>

              <a-col :xl="8" :md="12" :sm="24">
                <a-form-item label="告警时间" v-bind="formItemLayout" class="fw">
                  <a-range-picker
                    allowClear
                    format="YYYY-MM-DD HH:mm"
                    :placeholder="['开始时间', '结束时间']"
                    :ranges="{
                      最近1天: [moment().add(-1, 'days'), moment(), moment()],
                      最近1周: [moment().add(-7, 'days'), moment()],
                      最近1月: [moment().add(-30, 'days'), moment()],
                    }"
                    :showTime="{ format: 'HH:mm' }"
                    v-model="queryParams.receive_time"
                  />
                </a-form-item>
              </a-col>
              <a-col :xl="8" :md="12" :sm="24">
                <a-form-item label="ip" v-bind="formItemLayout" class="fw">
                  <a-input
                    allowClear
                    v-model.number="queryParams.ip"
                  ></a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <span :class="advanced ? 'expand' : 'collapse'">
            <QueryBtn @click="query" />
            <ResetBtn @click="resetQueryParams" />
            <!-- <ToggleBtn @click="toggleAdvanced" :advanced="advanced" /> -->
          </span>
        </a-form>
      </template>

      <!-- / 操作区域 -->
      <div class="operation" slot="operation">
        <div class="AlarmMonitor__operation">
          <div>
            <a-button :disabled="!hasSelected" :loading="exportLoading" v-if="showHistory" @click="onExportExcel()">导出</a-button>

            <a-button v-bind="btnProps" @click="onDetail()" :disabled="!hasSelectedOne">查看</a-button>

            <a-button
              v-bind="btnProps"
              v-if="showSolve"
              v-show="state !== ALARM_STATE.solved"
              @click="onSolve()"
              :disabled="!hasSelected"
            >解决</a-button
            >
          </div>

          <div class="AlarmMonitor__operation-badge-group">
            <span>告警级别：</span>
            <a-button
              v-for="(color, index) in colors"
              :key="index"
              shape="round"
              size="small"
              :style="{
                marginLeft: '4px',
                marginRight: '4px',
                backgroundColor: queryParams.alarmLevelList.includes(index + 1) ? color : '#f5f5f5',
                color: queryParams.alarmLevelList.includes(index + 1) ? '#fffced' : 'rgba(0,0,0,.25)',
                borderColor: 'transparent',
              }"
              @click="onToggleAlarmLevel(index + 1)"
            >{{ `L${index + 1}` }}</a-button
            >
          </div>

          <a-popover title="表格列设置" placement="leftBottom">
            <a-list slot="content" item-layout="horizontal" :data-source="availableColumns">
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
      </div>
    </CTable>

    <AlarmDetail ref="detail" @close="onDetailClose" />

    <AlarmSolve v-if="showSolve" ref="solve" @solveSuccess="onSolveSuccess" />
  </div>
</template>

<script>
import _ from 'lodash'
import Timeout from 'await-timeout'
import { Excel } from 'antd-vue-table-saveas-excel'
import moment from 'moment'
import { List } from '~~~/Mixins'
import QueryMixin from '../queryMixin'
import { AlarmService } from '@/api/index'
import { formatTime, generateQuery } from '@/utils/graphql'
import AlarmDetail from '../modules/AlarmDetail'
import AlarmSolve from '../modules/AlarmSolve'
import { ALARM_STATE } from '@/tables/alarm/enum'
import { levelColorMapping } from '~~~/Alarm/color.config'

export default {
  name: 'AlarmMonitor',
  mixins: [List, QueryMixin],
  components: {
    AlarmDetail,
    AlarmSolve
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
    // 历史告警为已经解决的主告警
    showHistory: {
      type: Boolean,
      default: false
    },
    queryParamsProps: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ALARM_STATE,
      colors: [...levelColorMapping.values()],
      exportLoading: false,
      formItemLayout: {
        labelCol: { xs: { span: 14 }, md: { span: 8 }, xl: { span: 8 }, xxl: { span: 4 } },
        wrapperCol: {
          xs: { span: 10, offset: 0 },
          md: { span: 14, offset: 0 },
          xl: { span: 14, offset: 2 },
          xxl: { span: 20, offset: 0 }
        }
      },
      ipList: [],
      state: ALARM_STATE.unSolved,
      columns: [
        {
          title: '告警级别',
          dataIndex: 'alarm_level',
          width: 100,
          sorter: true,
          show: true,
          fixed: 'left',
          customRender: (alarmLevel) => (
            <a-button
              disabled
              shape="round"
              size="small"
              style={{
                backgroundColor: levelColorMapping.get(Number(alarmLevel) - 1),
                color: '#fffced',
                cursor: 'default',
                borderColor: 'transparent'
              }}
            >
              L{alarmLevel}
            </a-button>
          )
        },
        {
          title: '数据域',
          dataIndex: `origin`,
          width: 100,
          show: true
        },
        {
          title: '品牌设备',
          dataIndex: `cmdbHost.modelHost.dictBrand.value_label`,
          width: 100,
          show: true
        },
        {
          title: 'IP',
          dataIndex: 'cmdbHost.ip',
          width: 120,
          show: true
        },
        {
          title: '监控对象',
          dataIndex: 'cmdbHost.alias',
          width: 290,
          show: true
        },
        {
          title: '监控实体',
          dataIndex: 'cmdbEndpoint.alias',
          width: 190,
          show: true,
          customRender: (text, record) => {
            const endpointAlias = _.get(record, 'cmdbEndpoint.alias', '')
            const endpointModelAlias = _.get(record, 'cmdbEndpoint.modelEndpoint.alias', '')
            return endpointAlias || endpointModelAlias || record.endpoint_id
          }
        },
        {
          title: '检查项',
          dataIndex: 'cmdbMetric.alias',
          width: 170,
          show: true,
          customRender: (text, record) => {
            const metricAlias = _.get(record, 'cmdbMetric.alias', '')
            const metricModelAlias = _.get(record, 'cmdbMetric.modelMetric.alias', '')
            return metricAlias || metricModelAlias || record.metric_id
          }
        },
        {
          title: '告警时间',
          dataIndex: 'receive_time',
          width: 170,
          show: true,
          sorter: true,
          defaultSortOrder: 'descend',
          customRender: formatTime
        },
        {
          title: '持续时间',
          width: 100,
          show: true,
          // 仅查看已解决的告警时展示该列
          validate: () => this.showHistory,
          customRender: (__, { receive_time, close_time }) => {
            if (receive_time && close_time) {
              const duration = moment(close_time).diff(moment(receive_time), 'minutes')
              return moment.duration(duration, 'minutes').humanize()
            } else {
              return ''
            }
          }
        },
        {
          title: '解决人',
          dataIndex: 'close_by',
          width: 100,
          show: true,
          // 仅查看已解决的告警时展示该列
          validate: () => this.showHistory,
          customRender: (closeBy) => (closeBy === 'auto' ? '自动' : closeBy)
        },
        {
          title: '告警描述',
          dataIndex: 'detail',
          width: 360,
          show: true
        },
        {
          title: '采集系统',
          dataIndex: 'agent_id',
          width: 90,
          show: true
        },
        {
          title: '操作',
          width: 50,
          show: true,
          // fixed: 'right',
          customRender: (__, record) => (
            <a-button
              type="link"
              style={{
                paddingLeft: 0
              }}
              onClick={() => this.onShowHistory(record)}
            >
              图表
            </a-button>
          ),
          validate: () => this.showHistory
        }
      ],
      queryParams: {
        alarmLevelList: [1, 2, 3, 4],
        dictValue: [],
        host_id: undefined,
        endpoint_id: undefined,
        metric_id: undefined,
        ip: undefined
      }
    }
  },
  computed: {
    hostTypeDictValueCode () {
      return this.queryParams.dictValue[2]
    },
    scrollX () {
      const { cTableProps = {}, visibleColumns } = this
      const { scroll = {} } = cTableProps
      const { x } = scroll
      return x || _.sum(visibleColumns.map((e) => e.width || 60))
    },
    scrollY () {
      const { scroll = {} } = this.cTableProps
      const { y = 'max(calc(100vh - 415px), 100px)' } = scroll
      return y
    },
    availableColumns () {
      const { columns } = this
      return columns.filter((column) => {
        if (column.validate) return column.validate()
        return true
      })
    },
    visibleColumns () {
      const { columnAlign: align, availableColumns } = this
      return availableColumns.filter(({ show }) => show).map((column) => Object.assign({}, column, { align }))
    }
  },
  methods: {
    moment,
    customRow ({ id }) {
      return {
        on: {
          dblclick: () => {
            this.onDetail(id)
          }
        }
      }
    },
    loadData ({ offset, limit, orderBy = { receive_time: 'desc' } }) {
      const {
        hostTypeDictValueCode,
        queryParams: { agent_id, alarmLevelList, ...queryParams },
        queryParamsProps
      } = this
      return AlarmService.find({
        where: {
          ...generateQuery(queryParams, true),
          ...generateQuery(queryParamsProps, true),
          ...generateQuery({ agent_id }),
          state: this.showHistory ? ALARM_STATE.solved : this.state,
          alarm_level: {
            _in: alarmLevelList
          },
          ...(hostTypeDictValueCode
            ? {
              cmdbHost: {
                modelHost: {
                  host_type_dict_value_code: {
                    _eq: hostTypeDictValueCode
                  }
                }
              }
            }
            : {})
        },
        fields: [
          'id',
          'state',
          'alarm_level',
          'host_id',
          'endpoint_id',
          'metric_id',
          `cmdbHost {
            alias
            ip
            modelHost { dictBrand { value_label } }
          }`,
          `cmdbEndpoint {
            alias
            modelEndpoint { alias }
          }`,
          `cmdbMetric {
            alias
            modelMetric { alias }
          }`,
          'receive_time',
          'close_time',
          'close_by',
          'detail',
          'agent_id',
          'origin'
        ],
        offset,
        limit,
        orderBy,
        alias: 'data'
      }).then((r) => r.data)
    },
    onChangDictValue (dictValue) {
      this.queryParams.dictValue = dictValue
      this.onChangeHostId()
    },
    onChangeHostId (hostId) {
      this.queryParams.host_id = hostId
      this.onChangeEndpointId()
    },
    onChangeEndpointId (endpointId) {
      this.queryParams.endpoint_id = endpointId
      this.onChangeMetricId()
    },
    onChangeMetricId (metricId) {
      this.queryParams.metric_id = metricId
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
     * 导出excel
     */
    async onExportExcel () {
      try {
        this.exportLoading = true

        const { columns: originalColumns, selectedRows } = this
        const columns = originalColumns.map(c => Object.assign({}, c))
        // 去除"操作"列
        columns.pop()
        // "告警级别"列导出文本而非DOM
        columns[0].customRender = (alarmLevel) => alarmLevel ? `L${alarmLevel}` : ''

        const excel = new Excel()
        await excel
          .addSheet('sheet')
          .addColumns(columns)
          .addDataSource(selectedRows, {}, 2)
          .saveAs(`告警历史${moment().format()}.xlsx`)
        await Timeout.set(900)

        this.$notification.success({
          message: '系统提示',
          description: '导出excel成功'
        })
      } catch (e) {
        this.$notification.error({
          message: '系统提示',
          description: h => h('p', { domProps: { innerHTML: `导出excel失败${e}` } })
        })
        throw e
      } finally {
        this.exportLoading = false
      }
    },
    /**
     * 查看告警历史曲线
     */
    onShowHistory (record) {
      this.$emit('showHistory', record)
    },
    /**
     * 关闭告警
     */
    onSolve () {
      const [...record] = this.selectedRowKeys
      this.$refs.solve.open(record)
    },
    /**
     * 关闭告警成功
     */
    onSolveSuccess () {
      this.query(false)
    },
    /**
     * 切换告警级别筛选条件
     */
    onToggleAlarmLevel (alarmLevel) {
      const { alarmLevelList = [] } = this.queryParams
      const index = alarmLevelList.indexOf(alarmLevel)
      if (index === -1) {
        alarmLevelList.push(alarmLevel)
      } else {
        alarmLevelList.splice(index, 1)
      }
      this.query(true)
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
.AlarmMonitor {
  &__operation {
    display: flex;
    flex-direction: row;
    width: 100%;

    &-badge-group {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex: 1;
      margin-left: 8px;
    }
  }

  .CTable-operation {
    padding-top: 0;
  }

  .expand {
    transform: translateY(-36.5px);
  }
}
</style>
