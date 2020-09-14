<script>
import { ModelService } from '@/api-hasura'
import SelectMixin from '../Common/SelectMixin'

export default {
  name: 'ModelHostTypeSelect',
  mixins: [SelectMixin],
  methods: {
    change (value, option) {
      SelectMixin.methods.change.apply(this, Array.from(arguments))
      // console.log(option)
      const target = this.list.find(({ key }) => key === value)
      this.$emit('update:hostType', target.host_type)
    },
    select (e) {
      this.$emit('select', e)
      console.log(e)
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
