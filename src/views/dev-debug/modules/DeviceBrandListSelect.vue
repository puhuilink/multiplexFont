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
import { ModelService } from '@/api-hasura'
import CListSelect from '~~~/ListSelect/CListSelect'

export default {
  name: 'DeviceBrandListSelect',
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
    async loadData (deviceType) {
      return ModelService.groupByModelFind({
        // TODO: Api
        // where: { deviceType },
        fields: [
          'key: model',
          'label: model'
        ],
        alias: 'dataSource'
      }).then(r => r.data.dataSource)
    }
  }
}
</script>

<style lang="less">

</style>
