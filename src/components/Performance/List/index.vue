<template>
  <div class="index">
    <CTable
      :columns="columns"
      :data="loadData"
      ref="table"
      :rowKey="rowKey"
      :rowSelection="null"
      :scroll="scroll"
    />
  </div>
</template>

<script>
/* eslint-disable vue/prop-name-casing */
import { List } from '@/components/Mixins'
import { MetricService } from '@/api-hasura'
import { generateQuery } from '@/utils/graphql'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'PerformanceList',
  mixins: [List],
  components: {},
  props: {
    where: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    columns: Object.freeze([
      {
        title: '设备',
        dataIndex: 'host_id host { alias }',
        sorter: true,
        width: 180,
        customRender: (__, { host_id, host = {} }) => host.alias || host_id
      },
      {
        title: '节点',
        dataIndex: 'endpoint_id',
        sorter: true,
        width: 180
      },
      {
        title: '检查项',
        dataIndex: 'metric_id',
        sorter: true,
        width: 180
      },
      {
        title: '指标值',
        dataIndex: 'metric_value metric_value_str',
        sorter: true,
        width: 180,
        customRender: (__, { metric_value, metric_value_str }) => metric_value || metric_value_str
      },
      {
        title: '采集时间',
        dataIndex: 'collect_time',
        sorter: true,
        width: 180,
        customRender: (collectTime) => collectTime ? moment(collectTime).format('YYYY-MM-DD HH:mm:ss') : ''
      }
    ])
  }),
  computed: {
    scrollY () {
      return 'max(calc(100vh - 220px), 100px)'
    }
  },
  watch: {
    where: {
      immediate: true,
      deep: true,
      async handler (where) {
        await this.$nextTick()
        !_.isEmpty(where) && this.$refs['table'].refresh(true)
      }
    }
  },
  methods: {
    loadData (parameter) {
      if (_.isEmpty(this.where)) {
        return {}
      }
      // FIXME: 数据域
      return MetricService.find(({
        where: generateQuery(this.where),
        fields: this.columns.map(({ dataIndex }) => dataIndex),
        ...parameter,
        alias: 'data'
      })).then(r => r.data)
    },
    rowKey (row) {
      return `${row.host_id}-${row.endpoint_id}-${row.metric_id}-${row.collect_time}`
    }
  }
}
</script>

<style lang="less">

</style>
