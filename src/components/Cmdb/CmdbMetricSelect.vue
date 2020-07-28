<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from './SelectMixin'

export default {
  name: 'CmdbMetricSelect',
  mixins: [SelectMixin],
  components: {},
  props: {
    endpointId: {
      type: Number,
      default: 0
    }
  },
  data: () => ({}),
  computed: {},
  watch: {
    endpointId: {
      immediate: true,
      handler (endpointId) {
        endpointId && this.fetch()
      }
    }
  },
  methods: {
    async fetch () {
      try {
        this.loading = true
        const { data: { metricList } } = await CmdbService.CmdbEndpointMetricDao({
          where: {
            enable: true,
            endpoint_id: this.endpointId
          },
          fields: [
            `metric {
              metric_config
              metric_id
              modelMetric {
                alias
              }
            }`
          ],
          alias: 'metricList'
        })
        this.list = metricList.map(({ metric }) => ({
          key: metric.metric_id,
          label: metric.modelMetric.alias
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
