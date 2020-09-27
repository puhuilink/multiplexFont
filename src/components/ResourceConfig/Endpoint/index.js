import { CmdbService, ModelService } from '@/api-hasura'
import SelectMixin from '../SelectMixin'

export default {
  name: 'EndpointSelect',
  mixins: [SelectMixin],
  methods: {
    async fetch (hostId) {
      try {
        this.loading = true
        this.list = await (
          this.schema === 'model'
            ? ModelService.endpointList(hostId)
            : CmdbService.endpointList(hostId)
        )
      } catch (e) {
        this.list = []
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}
