<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from '../Common/SelectMixin'

export default {
  name: 'CmdbEndpointSelect',
  mixins: [SelectMixin],
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async fetch (cmdbHostId) {
      try {
        this.loading = true
        this.list = await CmdbService.cmdbEndpointList(cmdbHostId)
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
