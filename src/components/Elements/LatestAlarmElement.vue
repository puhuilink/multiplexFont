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
import _ from 'lodash'

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
      return {
        style: _.get(this, ['elementProps', 'styleConfig', 'button'], {})
      }
    }
  }
}
</script>

<style lang="less">

</style>
