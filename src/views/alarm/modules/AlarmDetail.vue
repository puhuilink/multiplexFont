<template>
  <a-modal
    centered
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="AlarmDetail__modal"
    :afterClose="reset"
  >
    <template slot="footer">
      <a-button key="back" @click="cancel">取消</a-button>
      <a-button key="submit" type="primary" :disabled="disabled" @click="solve" v-if="useResolve">解决</a-button>
    </template>

    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="基础信息">
        <a-spin :spinning="spinning">
          <DetailForm :record="record" :formItemList="formItemList" />
        </a-spin>
      </a-tab-pane>

      <a-tab-pane key="2" tab="子告警记录">
        <CTable
          :columns="columns"
          :data="loadData"
          ref="table"
          rowKey="id"
          :rowSelection="null"
          :scroll="scroll"
        ></CTable>
      </a-tab-pane>
    </a-tabs>

    <AlarmSolve v-if="useResolve" ref="solve" @solveSuccess="solveSuccess" />
  </a-modal>
</template>

<script>
import { AlarmService } from '@/api'
import _ from 'lodash'
import Schema from '@/components/Mixins/Modal/Schema'
import CTable from '@/components/Table/CTable'
import AlarmSolve from './AlarmSolve'
import DetailForm from './DetailForm'
import { formatTime } from '@/utils/graphql'
import { ALARM_STATE } from '@/tables/alarm/enum'

export default {
  name: 'AlarmDetail',
  mixins: [Schema],
  props: {
    formItemList: {
      type: Array,
      default: () => [
        { label: '告警等级',
          key: 'alarm_level',
          customRender: (text) => (text ? {
            '1': '紧急告警',
            '2': '主要告警',
            '3': '次要告警',
            '4': '一般告警'
          }[text] : '') },
        { label: '告警次数', key: '' },
        { label: '首次告警时间', key: 'collect_time', customRender: formatTime },
        { label: '最近告警时间', key: 'receive_time', customRender: formatTime },
        { label: '数据域', key: 'agent_id' },
        { label: '监控类型', key: 'cmdbHost.host_type' },
        {
          children: [
            { label: '设备名称', key: 'cmdbHost.alias' },
            { label: '监控实体', key: 'cmdbEndpoint.modelEndpoint.alias' }
          ]
        },
        {
          children: [
            { label: '检查项', key: 'cmdbMetric.modelMetric.alias' },
            { label: '值', key: '' }
          ]
        },
        // { label: '通知等级', key: 'state' },
        {
          label: '告警状态',
          key: 'state',
          customRender: (text) => (text === ALARM_STATE.solved ? '已处理' : '未处理')
        },
        { label: '通知人员', key: 'forward_person' },
        { label: '通知时间', key: 'forward_person', customRender: formatTime },
        { label: '解决人员', key: 'close_by', customRender: formatTime },
        { label: '解决时间', key: 'close_time' },
        { label: '合并次数', key: 'merge_count' },
        { label: '合并时间', key: 'merge_time', customRender: formatTime },
        { label: '升级次数', key: 'upgrade_count' },
        { label: '升级时间', key: 'upgrade_time', customRender: formatTime },
        { label: '采集系统', key: 'agent_id' },
        { label: '告警描述', key: 'detail' }
      ]
    },
    useResolve: {
      type: Boolean,
      default: true
    }
  },
  components: {
    AlarmSolve,
    CTable,
    DetailForm
  },
  data () {
    return {
      columns: Object.freeze([
        {
          title: '告警级别',
          dataIndex: 'alarm_level',
          width: 60,
          sorter: true
        },
        {
          title: '告警时间',
          dataIndex: 'collect_time',
          width: 120,
          sorter: true,
          customRender: formatTime
        },
        {
          title: '告警描述',
          dataIndex: 'detail',
          width: 200,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '采集系统',
          dataIndex: 'agent_id',
          width: 100,
          sorter: true
        }
      ]),
      spinning: false,
      record: {}
    }
  },
  computed: {
    disabled () {
      return _.get(this.record, 'state') === ALARM_STATE.solved
    },
    scrollY () {
      // y 与 less height 保持一致
      return '500px'
    },
    scrollX () {
      const { columns = [] } = this
      return _.sum(columns.map((e) => e.width || 60))
    },
    scroll () {
      const { scrollY: y, scrollX: x } = this
      return {
        x,
        y
      }
    }
  },
  methods: {
    cancel () {
      this.visible = false
      // this.$emit('close', _.get(this.record, 'state'))
    },
    async fetch (id) {
      try {
        this.spinning = true
        this.record = await AlarmService.detail(id)
      } catch (e) {
        this.record = {}
        throw e
      } finally {
        this.spinning = false
      }
    },
    loadData (parameter) {
      return AlarmService.findSub({
        where: {
          parent_id: this.record.id
        },
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then((r) => r.data)
    },
    open (id) {
      this.fetch(id)
      this.show('告警信息')
    },
    solve () {
      this.$refs.solve.open(this.record.id)
    },
    solveSuccess () {
      this.record.state = ALARM_STATE.solved
      this.cancel()
    }
  }
}
</script>

<style lang="less">
.AlarmDetail__modal {
  .ant-tabs-tabpane {
    height: 500px;
    overflow-y: auto;
  }
}
</style>
