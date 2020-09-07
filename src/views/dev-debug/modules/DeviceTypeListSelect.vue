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

export default {
  name: 'DeviceModelListSelect',
  mixins: [],
  components: {
    CListSelect
  },
  props: {
    deviceBrand: {
      type: String,
      default: ''
    },
    ...CListSelect.props
  },
  data: () => ({}),
  computed: {},
  watch: {
    deviceBrand (deviceBrand) {
      this.$refs['listSelect'].reset()
      deviceBrand && this.$refs['listSelect'].refresh(deviceBrand)
    }
  },
  methods: {
    async loadData (model) {
      // TODO: Api
      return []
    }
  }
}
</script>

<style lang="less">

</style>
