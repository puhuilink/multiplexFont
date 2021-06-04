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
        hostAlias,
        endpointAlias,
        metricAlias,
        metricModelAlias,
        metric_id
      } = record
      this.$refs['historyChart'].showHistory({
        children: [{
          hostAlias,
          endpointAlias,
          metricModelAlias,
          metricAlias,
          metric_id
        }]
      })
    }
  }
}
</script>

<style lang="less">

</style>
