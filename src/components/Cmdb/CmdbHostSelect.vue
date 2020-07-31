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
        this.list = await CmdbService.cmdbHostList(modelHostId)
        console.log(this.list)
      } catch (e) {
        this.list = []
        throw e
      } finally {
        this.loading = false
      }
    }
  }
  // created () {
  //   this.fetch('ciscoRouter')
  // }
}
</script>

<style lang="less">

</style>
