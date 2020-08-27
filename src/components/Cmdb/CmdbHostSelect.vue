<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from './SelectMixin'

export default {
  name: 'CmdbHostSelect',
  mixins: [SelectMixin],
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    hostType: {
      type: String,
      default: ''
    }
  },
  watch: {
    hostType: {
      immediate: true,
      async handler (hostType) {
        this.list = []
        this.$emit('change', null)
        this.$emit('update:value', null)
        hostType && await this.fetch(hostType)
      }
    }
  },
  methods: {
    async fetch (hostType) {
      try {
        this.loading = true
        this.list = await CmdbService.cmdbHostList(hostType)
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
