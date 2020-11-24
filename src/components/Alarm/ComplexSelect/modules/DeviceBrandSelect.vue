<template>
  <CListSelect
    v-bind="$props"
    v-on="$listeners"
    autoLoad
    ref="listSelect"
    title="品牌名称"
    :data="loadData"
  />
</template>

<script>
import CListSelect from '~~~/ListSelect/CListSelect'
import { DictValueService } from '@/api'

export default {
  name: 'DeviceBrandSelect',
  mixins: [],
  components: {
    CListSelect
  },
  props: {
    ...CListSelect.props,
    deviceType: {
      type: String,
      default: ''
    }
  },
  data: () => ({}),
  computed: {},
  watch: {
    deviceType (deviceType) {
      this.$refs['listSelect'].reset()
      deviceType && this.$refs['listSelect'].refresh(deviceType)
    }
  },
  methods: {
    loadData (value_parent_code) {
      return DictValueService.find({
        where: { value_parent_code },
        fields: [
          'key: value_code',
          'label: value_label'
        ],
        alias: 'dataSource'
      }).then(r => r.data.dataSource)
    }
  }
}
</script>

<style lang="less">

</style>
