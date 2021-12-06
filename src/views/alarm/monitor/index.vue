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
      v-bind="cTableProps"
      :columns="visibleColumns"
      :customRow="cTableProps.customRow || customRow"
      :data="loadData"
      ref="table"
      rowKey="id"
      :rowSelection="showSelectRow ? rowSelection : undefined"
      :scroll="scroll"
      :show-pagination="showPagin"
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
                    :showTime="{ format: 'HH:mm:ss' }"
                    :defaultValue="[moment().add(-1, 'days'), moment()]"
                    v-model="queryParams.receive_time"
                  />
                </a-form-item>
              </a-col>
              <a-col :xl="8" :md="12" :sm="24">
                <a-form-item label="IP" v-bind="formItemLayout" class="fw">
                  <a-input
                    allowClear
                    v-model="ip"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :md="12" :sm="24">
                <a-form-item label="确认状态" v-bind="formItemLayout" class="fw">
                  <a-select
                    allowClear
                    v-model="queryParams.ack_status"
                  >
                    <a-select-option :value="0">
                      未确认
                    </a-select-option>
                    <a-select-option :value="1">
                      已确认
                    </a-select-option>
                  </a-select>
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

            <a-button v-if="showBtn" v-bind="btnProps" @click="onDetail()" :disabled="!hasSelectedOne">查看</a-button>

            <a-button
              v-bind="btnProps"
              v-if="showSolve"
              v-show="state !== ALARM_STATE.solved"
              @click="onComfirm"
              :disabled="hasAck"
            >确定告警</a-button>

            <a-button
              v-bind="btnProps"
              v-if="showSolve"
              v-show="state !== ALARM_STATE.solved"
              @click="onSolve()"
              :disabled="!hasSolve"
            >解决</a-button>
          </div>

          <div class="AlarmMonitor__operation-badge-group" v-if="showAlarmSelection">
            <span>告警级别：</span>
            <a-button
              v-for="(color, index) in colors"
              :key="index"
              :style="{
                borderColor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: queryParams.alarmLevelList.includes(index + 1) ? 'rgba(0,0,0,.5)' : '#f5f5f5'
              }"
              class="AlarmMonitor__operation-badge-group-btn"
              @click="onToggleAlarmLevel(index + 1)"
            >
              <a-icon
                :key="index"
                :style="{
                  color: queryParams.alarmLevelList.includes(index + 1) ? color : '#f5f5f5',
                  fontSize: '18px',
                  marginLeft: '10px'
                }"
                type="flag"
                theme="filled"
              />
              {{ fontColors.get(index + 1) }}
            </a-button>
          </div>

          <div style="height: 40px;line-height: 40px; margin-right: 30px;border-radius: 10px;" v-if="showTimer">
            页面刷新时间<a-input-number v-model="fetchTime" :min="1" :max="10"/>分钟
          </div>

          <a-popover title="表格列设置" placement="leftBottom" v-if="showSetting">
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
import moment, { now } from 'moment'
import { List } from '~~~/Mixins'
import QueryMixin from '../queryMixin'
import { AlarmService, CmdbHostEndpointMetricService, UserService } from '@/api/index'
import { formatTime, generateQuery } from '@/utils/graphql'
import AlarmDetail from '../modules/AlarmDetail'
import AlarmSolve from '../modules/AlarmSolve'
import { ALARM_STATE, ALARM_ACK_STATUS, ALARM_ACK_MAP } from '@/tables/alarm/enum'
import { levelColorMapping, fontLevelColorMapping, partLevelColorMapping } from '~~~/Alarm/color.config'
import { removeEmpty } from '@/utils/util'
const concatFields = ['hostAlias: host_alias', 'endpointAlias: endpoint_alias', 'endpointModelAlias: endpoint_model_alias', 'metricAlias: metric_alias', 'metricModelAlias: metric_model_alias', 'metric_id', 'device_model_value_code', 'brand_value_code', 'ip', 'type_model_name', 'device_model_name']
export default {
  name: 'AlarmMonitor',
  mixins: [List, QueryMixin],
  components: {
    AlarmDetail,
    AlarmSolve
  },
  props: {
    showBtn: {
      type: Boolean,
      default: true
    },
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
    showOrigin: {
      type: Boolean,
      default: true
    },
    showIp: {
      type: Boolean,
      default: true
    },
    showReceive: {
      type: Boolean,
      default: true
    },
    showAgent: {
      type: Boolean,
      default: true
    },
    showDeviceModel: {
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
    },
    showSelectRow: {
      type: Boolean,
      default: true
    },
    showSetting: {
      type: Boolean,
      default: true
    },
    showAlarmSelection: {
      type: Boolean,
      default: true
    },
    showAlarmIcon: {
      type: Boolean,
      default: true
    },
    showPagin: {
      type: Boolean,
      default: true
    },
    showTimer: {
      type: Boolean,
      default: true
    },
    inlineColumns: {
      type: Array,
      default: () => ([
        { title: 1 },
        { yue: 2 }
      ])
    }
  },
  data () {
    return {
      timer: null,
      ALARM_STATE,
      ALARM_ACK_STATUS,
      ALARM_ACK_MAP,
      alarmSearchTime: [moment().add(-1, 'days'), moment()],
      colors: [...partLevelColorMapping.values()],
      columns: [
        {
          title: '告警级别',
          dataIndex: 'alarm_level',
          width: 70,
          show: true,
          customRender: (alarmLevel) => (
            <div
              style={{
                // borderColor: 'transparent',
                color: 'rgba(0,0,0,.5)',
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontSize: '5px'
              }}
            >
              {this.showAlarmIcon ? <a-icon
                style={{
                  color: levelColorMapping.get(Number(alarmLevel)),
                  fontSize: '20px'
                }}
                type="flag"
                theme="filled"
              /> : <svg t="1629272702868" className="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="1114" width="20" height="20"
                data-spm-anchor-id="a313x.7781069.0.i4">
                <path
                  d="M881.387 297.813c38.08 65.387 57.28 136.747 57.28 214.187s-19.094 148.8-57.28 214.187c-38.187 65.28-89.92 117.12-155.2 155.2S589.44 938.667 512 938.667s-148.8-19.094-214.187-57.28c-65.28-38.08-117.013-89.814-155.306-155.307C104.427 660.8 85.333 589.44 85.333 512c0-77.333 19.094-148.693 57.28-214.187 38.08-65.28 89.814-117.013 155.307-155.306C363.2 104.533 434.56 85.333 512 85.333c77.333 0 148.693 19.094 214.187 57.28 65.28 38.187 117.013 89.92 155.2 155.2z m-217.707-47.36C617.387 223.467 566.827 209.92 512 209.92s-105.387 13.547-151.68 40.533-82.987 63.68-109.973 109.974c-26.987 46.293-40.534 96.853-40.534 151.68s13.547 105.386 40.534 151.68c26.986 46.293 63.68 82.986 109.973 109.973 46.293 26.987 96.853 40.533 151.68 40.533s105.387-13.546 151.68-40.533c46.293-26.987 82.987-63.68 109.973-109.973 26.987-46.294 40.534-96.854 40.534-151.68s-13.547-105.387-40.534-151.68c-27.093-46.294-63.786-82.987-109.973-109.974z"
                  p-id="1115" fill={`${levelColorMapping.get(Number(alarmLevel))}`}></path>
              </svg>}
            </div>

          )
        },
        {
          title: '确认状态',
          dataIndex: 'ack_status',
          width: 100,
          show: true,
          sorter: true,
          customRender: (ack_status) => {
            return ALARM_ACK_MAP.get(ack_status)
          }
        },
        {
          title: '确认人',
          dataIndex: 'staff_name',
          width: 100,
          show: true,
          customRender: (staff_name) => staff_name || ''
        },
        {
          title: '数据域',
          dataIndex: `origin`,
          width: 100,
          show: true,
          validate: () => this.showOrigin
        },
        {
          title: '设备类型',
          dataIndex: `type_model_name`,
          width: 100,
          show: true
        },
        {
          title: '品牌设备',
          dataIndex: `device_model_name`,
          width: 100,
          show: true,
          // customRender: (text, record) => {
          //   const brand = _.get(record, 'brand_value_code', '')
          //   const model = _.get(record, 'device_model_value_code', '')
          //   console.log(brand, model)
          //   return brand || model
          // },
          validate: () => this.showDeviceModel
        },
        {
          title: 'IP',
          dataIndex: 'ip',
          width: 120,
          show: true,
          validate: () => this.showIp
        },
        {
          title: '监控对象',
          dataIndex: 'hostAlias',
          width: 150,
          show: true
        },
        {
          title: '监控实体',
          dataIndex: 'endpointAlias',
          width: 190,
          show: true,
          customRender: (text, record) => {
            const endpointAlias = _.get(record, 'endpointAlias', '')
            const endpointModelAlias = _.get(record, 'endpointModelAlias', '')
            console.log()
            return endpointAlias.replaceAll('.', ' ') || endpointModelAlias.replaceAll('.', ' ') || record.endpoint_id
          }
        },
        {
          title: '检查项',
          dataIndex: 'metricAlias',
          width: 150,
          show: true,
          customRender: (text, record) => {
            const metricAlias = _.get(record, 'metricAlias', '')
            const metricModelAlias = _.get(record, 'metricModelAlias', '')
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
          customRender: formatTime,
          validate: () => this.showReceive
        },
        {
          title: '持续时间',
          width: 100,
          show: true,
          // 仅查看已解决的告警时展示该列
          customRender: (__, { first_time, close_time, receive_time }) => {
            if (receive_time || first_time) {
              const duration = moment(first_time || receive_time).diff(moment(close_time || now()), 'minutes')
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
          show: true,
          tooltip: true
        },
        {
          title: '采集系统',
          dataIndex: 'agent_id',
          width: 90,
          show: true,
          validate: () => this.showAgent
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
      fontColors: fontLevelColorMapping,
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
      fetchTime: 10,
      ip: '',
      ipList: [],
      state: ALARM_STATE.unSolved,
      queryParams: {
        alarmLevelList: [1, 2, 3, 4],
        dictValue: [],
        host_id: undefined,
        endpoint_id: undefined,
        metric_id: undefined,
        receive_time: [moment().add(-1, 'days'), moment()],
        ack_status: 0
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
    },
    hasAck () {
      for (const item of this.selectedRows) {
        if (item.ack_status === ALARM_ACK_STATUS.unAck) {
          return false
        }
      }
      return true
    },
    hasSolve () {
      if (this.selectedRows === []) {
        return false
      } else {
        for (const item of this.selectedRows) {
          if (item.ack_status === ALARM_ACK_STATUS.Ack) {
            return true
          }
        }
        return false
      }
    }
  },
  methods: {
    moment,
    customRow ({ id }, index) {
      const { customRow } = this.cTableProps
      return {
        on: {
          dblclick: () => {
            this.onDetail(id)
          }
        },
        customRow
      }
    },

    async ackAliasList (ids = []) {
      const { data: { names } } = await UserService.find({
        where: {
          user_id: { _in: ids }
        },
        fields: [
          'ack_by:user_id',
          'staff_name'
        ],
        alias: 'names'
      })
      return names
    },

    async aliasList (hostCondition = {}, fields = [], rest = {}) {
      const { data: { Host } } = await CmdbHostEndpointMetricService.findCommon({
        where: {
          ...hostCondition
        },
        fields: fields,
        alias: 'Host',
        ...rest
      })
      return Host
    },
    async alarmList (alarmCondition = {}, fields = [], rest = {}) {
      const { data } = await AlarmService.find({
        where: {
          ...alarmCondition,
          state: this.showHistory ? ALARM_STATE.solved : this.state
        },
        fields: fields,
        alias: 'data',
        ...rest
      })
      const metrics = data.data.map(el => el.metric_id)
      const acks = _.sortedUniq(removeEmpty(data.data.map(el => el.ack_by)))
      const concatList = await this.aliasList({ metric_id: { _in: metrics } }, concatFields)
      const concatUserList = await this.ackAliasList(acks)
      data.data.map(el => {
        return Object.assign(el, ...concatList.filter(ele => ele.metric_id === el.metric_id), ...concatUserList.filter(ele => ele.ack_by === el.ack_by))
      })
      return data
    },
    async loadData ({ offset, limit, orderBy = { receive_time: 'desc' } }) {
      const {
        hostTypeDictValueCode,
        queryParams: { agent_id, alarmLevelList, dictValue, ...queryParams },
        ip
      } = this
      const alarmFields = [
        'id',
        'state',
        'alarm_level',
        'host_id',
        'endpoint_id',
        'metric_id',
        'receive_time',
        'close_time',
        'close_by',
        'detail',
        'agent_id',
        'origin',
        'first_time',
        'ack_status',
        'ack_by',
        'ack_time'
      ]
      // const alarmFields = this.columns.map(({ dataIndex }) => dataIndex)
      // cmdb_host_endpoint_metric条件
      const hostCondition = {
        ...generateQuery({ device_model_value_code: hostTypeDictValueCode }, true),
        ...generateQuery({ ip: ip }, true)
      }
      // alarm条件
      const middleCondition = {
        ...generateQuery(queryParams, true),
        ...generateQuery({ agent_id: agent_id }, true)
      }
      let { alarmList } = Object
      if (!_.isEmpty(hostCondition)) {
        const fields = [
          'host_id'
        ]
        let hostList = await this.aliasList(hostCondition, fields, { distinct: 'host_id' })
        hostList = hostList.map(el => el.host_id)
        alarmList = await this.alarmList({ alarm_level: { _in: alarmLevelList }, 'host_id': { _in: hostList }, ...middleCondition }, alarmFields, { limit, offset, orderBy })
      } else {
        alarmList = await this.alarmList({ alarm_level: { _in: alarmLevelList }, ...middleCondition }, alarmFields, { limit, offset, orderBy })
      }
      return alarmList
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
     * 确认告警
     */
    onComfirm () {
      this.$confirm({
        title: '告警确认',
        content: '是否确认此告警到您账户上?',
        onOk: () => {
          return AlarmService.batchComfirm(this.selectedRowKeys)
            .then(({ msg, code }) => {
              if (code === 200) {
                this.$notification.success({
                  message: '系统提示',
                  description: '确认告警成功'
                })
                this.query(true)
              } else {
                this.$notification.error({
                  message: '系统提示',
                  description: msg
                })
              }
            })
        },
        onCancel () {}
      })
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
  },
  watch: {
    'fetchTime': {
      immediate: true,
      handler: function async (value) {
        // 动态刷新时间
        clearInterval(this.timer)
        // 关闭定时器的情况下默认刷新时间为一分钟
        if (!this.showTimer) {
          value = 1
        }
        this.timer = null
        this.timer = setInterval(() => {
          this.queryParams.receive_time = [moment().add(-1, 'days'), moment()]
          this.query(false)
        }, value * 60 * 1000)
      }
    }
  },
  destroyed () {
    clearInterval(this.timer)
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
