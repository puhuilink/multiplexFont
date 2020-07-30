<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from './SelectMixin'

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
    select (e) {
      console.log(e)
      this.$emit('select', e)
    },
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
                  alias
                }
              }`
          ],
          alias: 'endpointList'
        })
        this.list = endpointList.map(({ endpoint }) => ({
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
