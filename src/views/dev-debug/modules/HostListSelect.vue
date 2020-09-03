<template>
  <ListSelect
    :dataSource="dataSource"
    :loading="loading"
    multiple
    title="设备名称"
  />
</template>

<script>
import ListSelect from '~~~/ListSelect'
import Timeout from 'await-timeout'

export default {
  name: 'HostListSelect',
  mixins: [],
  components: {
    ListSelect
  },
  props: {},
  data: () => ({
    dataSource: [],
    loading: false
  }),
  computed: {},
  methods: {
    async fetch () {
      this.loading = true
      await Timeout.set(800)
      this.dataSource = [
        { key: 'printer1', title: '打印机1' },
        { key: 'printer2', title: '打印机2' },
        { key: 'printer3', title: '打印机3' }
      ]
      this.loading = false
    }
  },
  created () {
    this.fetch()
  }
}
</script>

<style lang="less">

</style>
