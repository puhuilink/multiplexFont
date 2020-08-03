<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from './SelectMixin'

export default {
  name: 'CmdbHostSelect',
  mixins: [SelectMixin],
  methods: {
    async fetch (modelHostId) {
      try {
        this.loading = true
        console.log(modelHostId)
        this.list = await CmdbService.cmdbHostList(modelHostId)
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
