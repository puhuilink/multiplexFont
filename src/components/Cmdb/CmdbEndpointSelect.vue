<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from './SelectMixin'

export default {
  name: 'CmdbEndpointSelect',
  mixins: [SelectMixin],
  methods: {
    async fetch (modelHostId) {
      try {
        this.loading = true
        this.list = await CmdbService.modelEndpointList(modelHostId)
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
