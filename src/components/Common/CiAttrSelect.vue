<template>
  <a-select
    class="fw"
    :filterOption="filterOption"
    :maxTagCount="5"
    mode="multiple"
    :notFoundContent="loading ? '加载中' : '暂无数据'"
    showSearch
  >
    <a-select-option v-for="{ attr_id, attr_name } in attrList" :key="attr_id">
      {{ attr_name }}
    </a-select-option>
  </a-select>
</template>

<script>
import { filterOption } from '@/utils/util'

export default {
  name: 'CiAttrSelect',
  mixins: [],
  components: {},
  props: {},
  data: () => ({
    attrList: []
  }),
  computed: {},
  methods: {
    filterOption,
    async loadData () {
      // TODO: api
      try {
        this.loading = true
        this.attrList = []
      } catch (e) {
        this.attrList = []
        throw e
      } finally {
        this.loading = false
      }
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="less">

</style>
