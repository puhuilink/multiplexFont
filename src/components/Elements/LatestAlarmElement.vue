<template>
  <div class="LatestAlarmElement">
    <AlarmMonitor
      :columnAlign="columnAlign"
      :btnProps="btnProps"
      :cTableProps="cTableProps"
      :showSolved="false"
    />
  </div>
</template>

<script>
// TODO: split common components
import AlarmMonitor from '@/views/alarm/monitor/index'

export default {
  name: 'LatestAlarmElement',
  mixins: [],
  components: {
    AlarmMonitor
  },
  props: {
    elementProps: {
      type: Object,
      default: () => ({
        data: [],
        loading: false
      })
    }
  },
  data: () => ({}),
  computed: {
    btnProps () {
      const { styleConfig = {} } = this.elementProps
      const { button: style } = styleConfig
      return { style }
    },
    columnAlign () {
      const { styleConfig = {} } = this.elementProps
      const { align = 'left' } = styleConfig
      return align
    },
    headerRowStyle () {
      const { styleConfig = {} } = this.elementProps
      const { header = {} } = styleConfig
      return header
    },
    rowStyle () {
      const { styleConfig = {} } = this.elementProps
      const { rows = {} } = styleConfig
      return rows
    },
    cTableProps () {
      const { customRow, headerRowStyle } = this
      return {
        customRow,
        customHeaderRow: () => ({ style: headerRowStyle })
      }
    }
  },
  methods: {
    customRow (record, index) {
      return {
        style: this.rowStyle
      }
    }
  }
}
</script>

<style lang="less">

</style>
