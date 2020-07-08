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
        <DetailForm :record="record" :formItemList="formItemList" />
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

    <AlarmSolve
      v-if="useResolve"
      ref="solve"
      @solveSuccess="solveSuccess"
    />
  </a-modal>
</template>

<script>
import { AlarmService } from '@/api-hasura/index'
import _ from 'lodash'
import Schema from '@/components/Mixins/Modal/Schema'
import CTable from '@/components/Table/CTable'
import AlarmSolve from './AlarmSolve'
import DetailForm from './DetailForm'

export default {
  name: 'AlarmDetail',
  mixins: [Schema],
  props: {
    formItemList: {
      type: Array,
      default: () => [
        { label: '告警编号', key: 'id' },
        { label: '告警等级', key: 'alarm_level' },
        {
          children: [
            { label: '升级次数', key: '' },
            { label: '升级时间', key: '' }
          ]
        },
        { label: '告警状态', key: 'state' },
        { label: '设备名称', key: '' },
        {
          children: [
            { label: '监控实体', key: '' },
            { label: '检查项', key: '' },
            { label: '值', key: '' }
          ]
        },
        { label: '首次告警时间', key: '' },
        { label: '最近告警时间', key: '' },
        { label: '前转人', key: 'forward_person' },
        { label: '前转时间', key: 'forward_time' },
        { label: '合并时间', key: 'merge_time' },
        { label: '合并次数', key: 'merge_count' },
        { label: '采集系统', key: 'agent_id' },
        { label: '消息内容', key: 'detail' }
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
  data: () => ({
    columns: Object.freeze([
      {
        title: '告警级别',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true
      },
      {
        title: '告警时间',
        dataIndex: 'receive_time',
        width: 200,
        sorter: true
      },
      {
        title: '告警描述',
        dataIndex: 'detail',
        width: 200,
        sorter: true
      },
      {
        title: '采集系统',
        dataIndex: 'agent_id',
        width: 200,
        sorter: true
      }
    ]),
    spinning: false,
    record: {}
  }),
  computed: {
    disabled () {
      // 1 代表已解决
      return _.get(this.record, 'state') === 1
    },
    scroll () {
      // y 与 less height 保持一致
      return { x: true, y: '500px' }
    }
  },
  methods: {
    cancel () {
      this.visible = false
      this.$emit('close', _.get(this.record, 'state'))
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
      }).then(r => r.data)
    },
    open (id) {
      this.fetch(id)
      this.show('告警信息')
    },
    solve () {
      this.$refs.solve.open(this.record.id)
    },
    solveSuccess () {
      this.record.state = 1
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