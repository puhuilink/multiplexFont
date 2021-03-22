<template>
  <fragment>
    <BusinessSystemTree v-model="config.systemId"/>
    <BusinessSystemCascader :config="config" :hostIds="config.hostIds"/>
  </fragment>
</template>
<script>
import { CmdbHostTreeService } from '@/api/index'
import BusinessSystemTree from '~~~/BusinessSystemTree'
import BusinessSystemCascader from '~~~/BusinessSystemCascader/index'
export default {
  name: 'BusinessSystemItem',
  components: {
    BusinessSystemCascader,
    BusinessSystemTree
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      hostIds: []
    }
  },
  methods: {
    // 查询hostId
    async hostIdsColumn (data) {
      try {
        const hostIds = await CmdbHostTreeService.hostIdsQuery(data)
        this.config.hostIds = hostIds[0].host_ids
      } catch (e) {
        this.config.hostIds = []
        throw e
      }
    }
  },
  watch: {
    'config.systemId': {
      immediate: true,
      handler () {
        this.hostIdsColumn(this.config.systemId)
      }
    }
  }
}
</script>

<style scoped>

</style>
