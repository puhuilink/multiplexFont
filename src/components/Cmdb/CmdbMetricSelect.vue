<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from './SelectMixin'

export default {
  name: 'CmdbMetricSelect',
  mixins: [SelectMixin],
  methods: {
    async fetch (modelEndpointId) {
      try {
        this.loading = true
        this.list = await CmdbService.modelMetricList(modelEndpointId)
      } catch (e) {
        this.list = []
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less">

</style>
