<template>
  <CListSelect
    v-bind="$props"
    v-on="$listeners"
    :data="loadData"
    ref="listSelect"
    title="品牌设备"
  />
</template>

<script>
import CListSelect from '~~~/ListSelect/CListSelect'
import { ModelService } from '@/api-hasura'

export default {
  name: 'DeviceModelListSelect',
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
  watch: {
    deviceBrand (deviceBrand) {
      this.$refs['listSelect'].reset()
      deviceBrand && this.$refs['listSelect'].refresh(deviceBrand)
    }
  },
  methods: {
    loadData (model) {
      return ModelService.hostFind({
        where: { model },
        fields: [
          'key: host_type',
          'label: host'
        ],
        alias: 'dataSource'
      }).then(r => r.data.dataSource)
    }
  }
}
</script>

<style lang="less">

</style>
