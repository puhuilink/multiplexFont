<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from './SelectMixin'

export default {
  name: 'CmdbHostTypeSelect',
  mixins: [SelectMixin],
  components: {},
  props: {},
  data: () => ({}),
  computed: {},
  methods: {
    async fetch () {
      try {
        this.loading = true
        const { data: { hostTypeList } } = await CmdbService.hostTypeFind({
          fields: [
            'key: host_type',
            'label: host_type'
          ],
          alias: 'hostTypeList'
        })
        this.list = hostTypeList
      } catch (e) {
        this.list = []
        throw e
      } finally {
        this.loading = false
      }
    }
  },
  created () {
    this.fetch()
  }
}
</script>

<style lang="less">

</style>
