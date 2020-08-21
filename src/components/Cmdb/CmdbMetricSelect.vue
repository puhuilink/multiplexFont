<script>
import { ModelService } from '@/api-hasura'
import SelectMixin from './SelectMixin'

export default {
  name: 'CmdbMetricSelect',
  mixins: [SelectMixin],
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async fetch (endpointModel) {
      try {
        this.loading = true
        this.list = await ModelService.modelMetricList(endpointModel)
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
