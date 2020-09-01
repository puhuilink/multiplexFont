<template>
  <div class="AlarmLogHistory">
    <AlarmMonitor
      showAll
      :showSolved="false"
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
