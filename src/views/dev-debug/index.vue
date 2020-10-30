<template>
  <div class="DevDebug">
    <PerformanceAggregate
      :where="{
        host_id: 8214640207204366
      }"
    />
  </div>
</template>

<script>
import PerformanceAggregate from '@/components/Performance/Aggregate'

export default {
  name: 'DevDebug',
  mixins: [],
  components: {
    PerformanceAggregate
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
