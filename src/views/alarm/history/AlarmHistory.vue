<template>
  <div class="AlarmHistory">
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
                  label="数据域"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.user_id" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="监控设备"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="监控实例"
                  v-bind="formItemLayout"
                  style="width: 100%"
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
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.user_id" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="采集系统"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="开始结束时间"
                  v-bind="formItemLayout"
                  style="width: 100%"
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
      <template #operation>
        <a-button @click="onDetail" :disabled="!hasSelectedOne">查看</a-button>
        <a-button @click="onExport" :disabled="!hasSelected">导出</a-button>
      </template>
    </CTable>

    <AlarmHistoryDetail ref="detail" />
  </div>
</template>

<script>
import { AlarmService } from '@/api-hasura/index'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import { List } from '@/components/Mixins'
import AlarmHistoryDetail from './modules/AlarmHistoryDetail'

export default {
  name: 'AlarmHistory',
  mixins: [List],
  components: {
    AlarmHistoryDetail
  },
  props: {},
  data: () => ({
    columns: Object.freeze([
      {
        title: '告警级别',
        dataIndex: 'alarm_level',
        width: 200,
        sorter: true
      },
      // {
      //   title: '数据域',
      //   dataIndex: 'alarm_level',
      //   width: 200,
      //   sorter: true
      // },
      {
        title: '监控设备',
        dataIndex: 'host_id',
        width: 200
        // sorter: true
      },
      {
        title: '监控实例',
        dataIndex: 'metric_id',
        width: 200
        // sorter: true
      },
      {
        title: '检查项',
        dataIndex: 'endpoint_id',
        width: 200
        // sorter: true
      },
      // {
      //   title: '值',
      //   dataIndex: 'email',
      //   width: 200,
      //   sorter: true
      // },
      // {
      //   title: '首次告警时间',
      //   dataIndex: 'email',
      //   width: 200,
      //   sorter: true
      // },
      // {
      //   title: '最近告警时间',
      //   dataIndex: 'email',
      //   width: 200,
      //   sorter: true
      // },
      // {
      //   title: '次数',
      //   dataIndex: 'email',
      //   width: 200,
      //   sorter: true
      // },
      {
        title: '采集系统',
        dataIndex: 'agent_id',
        width: 200,
        sorter: true
      }
    ])
  }),
  computed: {},
  methods: {
    loadData (parameter) {
      return AlarmService.find({
        where: {
          ...generateQuery(this.queryParams)
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
    onExport () {}
  }
}
</script>

<style lang="less">

</style>
