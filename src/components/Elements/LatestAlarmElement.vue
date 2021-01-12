<template>
  <div class="list-element">
    <AlarmMonitor
      :btnProps="btnProps"
      :columnAlign="align"
      :cTableProps="cTableProps"
      :showSolve="false"
      :showQuery="false"
    />
  </div>
</template>

<script>
// TODO: split common components
import AlarmMonitor from '@/views/alarm/monitor/index'
import ListMixin from '@/components/Elements/ListMixin'

export default {
  name: 'LatestAlarmElement',
  mixins: [ListMixin],
  components: {
    AlarmMonitor
  },
  computed: {
    cTableProps () {
      const {
        headerRowStyle,
        rowStyle,
        scroll
      } = this
      return {
        customHeaderRow: () => ({ style: headerRowStyle }),
        customRow: () => ({ style: rowStyle }),
        scroll
      }
    },
    btnProps () {
      const {
        styleConfig = {}
      } = this.elementProps
      return {
        style: styleConfig.button || {}
      }
    }
  }
}
</script>

<style lang="less">

</style>
