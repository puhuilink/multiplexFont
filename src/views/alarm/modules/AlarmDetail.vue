<template>
  <a-modal
    centered
    :confirmLoading="confirmLoading"
    :title="title"
    v-model="visible"
    :width="940"
    wrapClassName="AlarmDetail__modal"
    :afterClose="reset"
  >
    <template slot="footer">
      <a-button key="back" @click="cancel">取消</a-button>
      <a-button key="submit" type="primary" :disabled="disabled" @click="solve">解决</a-button>
    </template>

    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="基础信息">
        <a-form-model layout="vertical">
          <a-row>
            <a-col
              :md="12"
              :sm="24"
              v-for="({ label, key, children = [] }, idx) in formItemList"
              :key="idx"
            >

              <a-row v-if="children.length">
                <a-col
                  :md="24 / children.length"
                  :sm="24"
                  v-for="(child, childIdx) in children"
                  :key="childIdx"
                >
                  <a-form-model-item v-bind="formItemLayout" :label="child.label">
                    <a-input readOnly :value="record[child.key]" />
                  </a-form-model-item>
                </a-col>
              </a-row>

              <a-form-model-item v-else v-bind="formItemLayout" :label="label" >
                <a-input readOnly :value="record[key]" />
              </a-form-model-item>

            </a-col>
          </a-row>
        </a-form-model>
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

export default {
  name: 'AlarmDetail',
  mixins: [Schema],
  components: {
    AlarmSolve,
    CTable
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
    formItemList: Object.freeze([
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
    ]),
    loading: false,
    record: {}
  }),
  computed: {
    disabled () {
      // 1 代表已解决
      return _.get(this.record, 'state') === 1
    },
    scroll () {
      return { x: true, y: 'max(calc(100vh - 320px), 500px)' }
    }
  },
  methods: {
    cancel () {
      this.visible = false
      this.$emit('close', _.get(this.record, 'state'))
    },
    async fetch (id) {
      try {
        this.loading = true
        this.record = await AlarmService.detail(id)
      } catch (e) {
        this.record = {}
        throw e
      } finally {
        this.loading = false
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
    solveSuccess () {}
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
