<script>
import { ModelService } from '@/api-hasura'
import SelectMixin from '../Common/SelectMixin'

export default {
  name: 'ModelEndpointSelect',
  mixins: [SelectMixin],
  methods: {
    async fetch (parentId) {
      try {
        this.loading = true
        this.list = await ModelService.modelEndpointList(parentId)
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
