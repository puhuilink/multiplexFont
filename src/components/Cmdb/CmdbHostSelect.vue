<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from './SelectMixin'

export default {
  name: 'CmdbHostSelect',
  mixins: [SelectMixin],
  components: {},
  props: {
    hostType: {
      type: String,
      default: ''
    }
  },
  data: () => ({}),
  computed: {},
  watch: {
    hostType: {
      immediate: true,
      handler (hostType) {
        hostType && this.fetch()
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
        const { data: { hostList } } = await CmdbService.hostFind({
          where: {
            host_type: this.hostType,
            enable: true
          },
          fields: [
            'key: id',
            'label: alias'
          ],
          alias: 'hostList'
        })
        this.list = hostList
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
