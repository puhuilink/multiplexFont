<script>
import { ModelService } from '@/api-hasura'
import SelectMixin from './SelectMixin'

export default {
  name: 'ModelHostTypeSelect',
  mixins: [SelectMixin],
  methods: {
    select (e) {
      this.$emit('select', e)
      this.$emit('update:value', e)
    },
    async fetch () {
      try {
        this.loading = true
        this.list = await ModelService.modelHostTypeList()
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
