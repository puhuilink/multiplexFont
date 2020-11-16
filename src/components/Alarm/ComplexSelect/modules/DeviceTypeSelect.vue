<template>
  <CListSelect
    v-bind="$props"
    v-on="$listeners"
    :data="loadData"
    ref="listSelect"
    title="监控类型"
  />
</template>

<script>
import CListSelect from '~~~/ListSelect/CListSelect'
import { DictValueService } from '@/api'

export default {
  name: 'DeviceTypeSelect',
  mixins: [],
  components: {
    CListSelect
  },
  props: {
    ...CListSelect.props,
    deviceBrand: {
      type: String,
      default: ''
    }
  },
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {
    async loadData () {
      return DictValueService.find({
        where: {
          value_param: '1'
        },
        fields: [
          'key: value_code',
          'label: value_label'
        ],
        alias: 'dataSource'
      }).then(r => r.data.dataSource)
    }
  },
  mounted () {
    this.$refs['listSelect'].refresh()
  }
}
</script>

<style lang="less">

</style>
