<template>
  <div class="AlarmLogHistory">
    <AlarmMonitor
      showHistory
      :showSolve="false"
      :cTableProps="{
        scroll: {
          y: 'max(calc(100vh - 360px), 100px)'
        }
      }"
      @showHistory="onShowHistory"
    />

    <HistoryChart ref="historyChart" />
  </div>
</template>

<script>
// TODO: 组件拆分
import AlarmMonitor from '../../monitor'
import HistoryChart from '@/components/Performance/Aggregate/HistoryChart'

export default {
  name: 'AlarmLogHistory',
  mixins: [],
  components: {
    AlarmMonitor,
    HistoryChart
  },
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {
    onShowHistory (record) {
      const {
        cmdbHost: { alias: host_alias },
        cmdbEndpoint: { alias: endpoint_alias },
        cmdbMetric: { alias: metric_alias, modelMetric = {} },
        metric_id
      } = record
      this.$refs['historyChart'].showHistory({
        children: [{
          host_alias,
          endpoint_alias,
          metric: {
            alias: metric_alias || modelMetric.alias
          },
          metric_id
        }]
      })
    }
  }
}
</script>

<style lang="less">

</style>
