<template>
  <CListSelect
    v-bind="$props"
    v-on="$listeners"
    :data="loadData"
    multiple
    ref="listSelect"
    title="设备名称"
  />
</template>

<script>
import CListSelect from '~~~/ListSelect/CListSelect'
import { CmdbService } from '@/api-hasura'

export default {
  name: 'CmdbHostSelect',
  mixins: [],
  components: {
    CListSelect
  },
  props: {
    ...CListSelect.props,
    hostType: {
      type: String,
      default: ''
    }
  },
  data: () => ({}),
  computed: {},
  watch: {
    hostType (hostType) {
      this.$refs['listSelect'].reset()
      hostType && this.$refs['listSelect'].refresh(hostType)
    }
  },
  methods: {
    loadData (host_type) {
      return CmdbService.hostFind({
        where: { host_type },
        fields: [
          'key: id',
          'label: alias'
        ],
        alias: 'dataSource'
      }).then(r => r.data.dataSource)
    }
  }
}
</script>

<style lang="less">

</style>
