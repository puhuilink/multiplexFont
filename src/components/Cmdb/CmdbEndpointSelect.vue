<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from './SelectMixin'
import _ from 'lodash'

export default {
  name: 'CmdbEndpointSelect',
  mixins: [SelectMixin],
  components: {},
  props: {
    hostId: {
      type: Number,
      default: 0
    }
  },
  data: () => ({}),
  computed: {},
  watch: {
    hostId: {
      immediate: true,
      handler (hostId) {
        hostId && this.fetch()
      }
    }
  },
  methods: {
    async fetch () {
      try {
        this.loading = true
        const { data: { endpointList } } = await CmdbService.endpointFind({
          where: {
            // enable: true
            host_id: this.hostId
          },
          fields: [
            `endpoint {
                endpoint_id
                modelEndpoint {
                  id
                  alias
                }
              }`
          ],
          alias: 'endpointList'
        })
        const validEndpointList = endpointList.filter(({ endpoint }) => endpoint.endpoint_id && endpoint.modelEndpoint)
        const uniqEndpointList = _.uniqBy(validEndpointList, ({ endpoint }) => endpoint.modelEndpoint.id)
        console.log(uniqEndpointList)
        this.list = uniqEndpointList.map(({ endpoint }) => ({
          key: endpoint.endpoint_id,
          label: endpoint.modelEndpoint.alias
        }))
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
