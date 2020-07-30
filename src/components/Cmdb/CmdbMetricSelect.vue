<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from './SelectMixin'
import _ from 'lodash'

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
    select (e) {
      console.log(e)
      this.$emit('select', e)
    },
    async fetch () {
      try {
        this.loading = true
        const { data: { metricList } } = await CmdbService.metricFind({
          where: {
            // enable: true,
            endpoint_id: this.endpointId
          },
          fields: [
            `metric {
              metric_model_id
              metric_id
              enable
              modelMetric {
                alias
              }
            }`
          ],
          alias: 'metricList'
        })
        const uniqMetricList = _.uniqBy(metricList, ({ metric }) => metric.metric_model_id)
        this.list = uniqMetricList.filter(({ metric }) => metric.modelMetric && metric.enable).map(({ metric }) => ({
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
