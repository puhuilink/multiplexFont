<script>
import { CmdbService } from '@/api-hasura'
import SelectMixin from './SelectMixin'

export default {
  name: 'CmdbHostTypeSelect',
  mixins: [SelectMixin],
  computed: {
    multiple () {
      return false
    }
  },
  methods: {
    select (e) {
      this.$emit('select', e)
      this.$emit('update:value', e)
    },
    async fetch () {
      try {
        this.loading = true
        this.list = await CmdbService.modelHostTypeList()
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
