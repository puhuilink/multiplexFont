<template>
  <div class="ForwardHistory">
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
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="前转名称"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.user_id" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="前转方式"
                  v-bind="formItemLayout"
                  class="fw"
                >
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="时间范围"
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
          </span>

        </a-form>
      </template>

      <!-- / 操作区域 -->
      <template #operation>
        <a-button @click="onDetail" :disabled="!hasSelectedOne">查看</a-button>
      </template>
    </CTable>

    <ForwardHistoryDetail ref="detail" />
  </div>
</template>

<script>
import { List } from '@/components/Mixins'
import { AlarmForwardService } from '@/api'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import ForwardHistoryDetail from '../modules/ForwardHistoryDetail'
import moment from 'moment'

export default {
  name: 'ForwardHistory',
  mixins: [List],
  components: {
    ForwardHistoryDetail
  },
  props: {},
  data: () => ({
    columns: Object.freeze([
      {
        title: '告警级别',
        width: 90,
        customRender: (__, alarm) => _.get(alarm, ['alarm_level'], '')
      },
      {
        title: '事件等级',
        width: 90,
        customRender: (__, alarm) => _.get(alarm, ['event_level'], '')
      },
      {
        title: '数据域',
        dataIndex: 'domain',
        width: 100
      },
      {
        title: '设备名称',
        width: 120,
        customRender: (__, { alarm }) => _.get(alarm, ['cmdbHostEndpointMetric', 'host_alias'])
      },
      {
        title: '监控实体',
        width: 120,
        tooltip: true,
        customRender: (__, { alarm }) => _.get(alarm, ['cmdbHostEndpointMetric', 'endpoint_alias'])
      },
      {
        title: '检查项',
        width: 120,
        customRender: (__, { alarm }) => _.get(alarm, ['cmdbHostEndpointMetric', 'metric_alias'])
      },
      {
        title: '前转内容',
        dataIndex: 'send_content',
        width: 420,
        tooltip: true
      },
      {
        title: '通知时间',
        dataIndex: 'send_time',
        width: 120,
        sorter: true,
        customRender: send_time => send_time ? moment(send_time).format() : ''
      },
      {
        title: '通知状态',
        dataIndex: 'status',
        width: 90,
        sorter: true,
        customRender: status => status ? '已通知' : '通知失败'
      }
    ])
  }),
  computed: {},
  methods: {
    loadData (parameter) {
      return AlarmForwardService.findHistory({
        where: {
          ...generateQuery(this.queryParams)
        },
        fields: [
          'id',
          'domain',
          'send_content',
          'send_time',
          'status',
          `alarm {
            alarm_level
            event_level
            cmdbHostEndpointMetric {
              host_alias
              endpoint_alias
              metric_alias
            }
          }`
        ],
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    onDetail () {
      // const [id] = this.selectedRowKeys
      const [record] = this.selectedRows
      this.$refs.detail.open(record)
    }
  }

}
</script>

<style lang="less">

</style>
