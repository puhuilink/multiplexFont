<template>
  <a-select
    class="fw"
    v-bind="$props"
    v-on="$listeners"
  >
    <a-select-option
      v-for="item in list"
      :key="item.value"
      :value="item.value"
    >{{ item.label }}</a-select-option>
  </a-select>
</template>
<script>
import { Select } from 'ant-design-vue'
import { CmdbService } from '@/api/service/CmdbService'

export default {
  name: 'OriginSelect',
  mixins: [],
  extends: Select,
  components: {
    CmdbService
  },
  props: {},
  data: () => ({
    list: []
  }),
  computed: {},
  mounted () {
    this.loadList()
  },
  methods: {
    async loadList () {
      const { data: { data } } = await CmdbService.find({
        distinct: 'location',
        fields: ['location'],
        alias: 'data'
      })
      data.map(el => this.list.push({ label: el.location, value: el.location }))
    }
  }
}
</script>

<style lang="less">

</style>
