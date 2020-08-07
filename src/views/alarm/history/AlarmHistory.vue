<template>
  <div class="AlarmHistory">
    <AlarmMonitor
      showAll
      :showSolved="false"
    />
  </div>
</template>

<script>
// TODO: 组件拆分
import AlarmMonitor from '../AlarmMonitor'

export default {
  name: 'AlarmHistory',
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
