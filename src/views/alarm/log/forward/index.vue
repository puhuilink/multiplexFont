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
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.user_id" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="前转方式"
                  v-bind="formItemLayout"
                  style="width: 100%"
                >
                  <a-input allowClear v-model.trim="queryParams.staff_name" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="时间范围"
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
import { AlarmForwardService } from '@/api-hasura'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import ForwardHistoryDetail from '../modules/ForwardHistoryDetail'

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
        title: '前转编号',
        dataIndex: 'id',
        width: 200,
        sorter: true
      },
      // {
      //   title: '前转名称',
      //   dataIndex: 'alarm_level',
      //   width: 200,
      //   sorter: true
      // },
      // {
      //   title: '事件等级',
      //   dataIndex: 'alarm_level',
      //   width: 200,
      //   sorter: true
      // },
      {
        title: '数据域',
        dataIndex: 'domain',
        width: 200,
        sorter: true
      },
      {
        title: '设备名称',
        dataIndex: 'host_id',
        width: 120,
        sorter: true
      },
      {
        title: '监控实体',
        dataIndex: 'endpoint_id',
        width: 120,
        sorter: true
      },
      {
        title: '检查项',
        dataIndex: 'metric_id',
        width: 120,
        sorter: true
      },
      {
        title: '前转内容',
        dataIndex: 'send_content',
        width: 420,
        tooltip: true
      },
      // {
      //   title: '前转方式',
      //   dataIndex: 'alarm_level',
      //   width: 200,
      //   sorter: true
      // },
      {
        title: '前转时间',
        dataIndex: 'send_time',
        width: 200,
        sorter: true
      },
      {
        title: '前转状态',
        dataIndex: 'status',
        width: 90,
        sorter: true,
        customRender: status => status ? '成功' : '失败'
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
        fields: _.uniq(['id', ...this.columns.map(({ dataIndex }) => dataIndex)]),
        ...parameter,
        alias: 'data'
      }).then(r => r.data)
    },
    onDetail () {
      const [id] = this.selectedRowKeys
      this.$refs.detail.open(id)
    }
  }

}
</script>

<style lang="less">

</style>
