<template>
  <ListSelect
    :dataSource="dataSource"
    :loading="loading"
    title="品牌名称"
  />
</template>

<script>
import ListSelect from '~~~/ListSelect'
import Timeout from 'await-timeout'

export default {
  name: 'BrandListSelect',
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
        { key: '3Com', label: '3Com' },
        { key: 'Dell', label: '戴尔' }
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
