<script>
import { ModelService } from '@/api-hasura'
import SelectMixin from '../Common/SelectMixin'

export default {
  name: 'ModelMetricSelect',
  mixins: [SelectMixin],
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async fetch (modelEndpointId) {
      try {
        this.loading = true
        this.list = await ModelService.modelMetricList(modelEndpointId)
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
