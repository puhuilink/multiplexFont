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
    />
  </div>
</template>

<script>
// TODO: 组件拆分
import AlarmMonitor from '../../monitor'

export default {
  name: 'AlarmLogHistory',
  mixins: [],
  components: {
    AlarmMonitor
  },
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
