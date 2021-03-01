<script>
import AlarmRuleSchema from './modules/AlarmRuleSchema/index'
import AlarmRuleDetailSchema from './modules/AlarmRuleDetailSchema/index'
import AlarmRuleGlobalSchema from './modules/AlarmRuleGlobalSchema/index'
import { Confirm, List } from '@/components/Mixins'
import { AlarmRuleService } from '@/api'

export default {
  name: 'RuleMixin',
  mixins: [Confirm, List],
  components: {
    AlarmRuleSchema,
    AlarmRuleDetailSchema,
    AlarmRuleGlobalSchema
  },
  props: {},
  data: () => ({
  }),
  computed: {},
  methods: {
    /**
     * @param {String[]} ruleType 要新增的规则类型
     */
    onAdd (ruleType = []) {
      this.$refs.schema.add(ruleType)
    },
    async onBatchDelete () {
      this.$promiseConfirmDelete({
        onOk: () => AlarmRuleService
          .batchDelete(this.selectedRowKeys)
          .then(() => {
            this.$notifyDeleteSuccess()
            this.query(false)
          })
          .catch(this.$notifyError)
      })
    },
    onDetail () {
      const [id] = this.selectedRowKeys
      this.$refs['detail'].detail(id)
    },
    onEditGlobalRule ({ key: ruleType }) {
      this.$refs['global'].edit(ruleType)
    },
    async onToggleEnabled (id, enabled) {
      try {
        this.$refs['table'].loading = true
        await AlarmRuleService.batchToggleEnabled([id], enabled)
        await this.query(false)
      } catch (e) {
        throw e
      } finally {
        this.$refs['table'].loading = false
      }
    },
    onEdit () {
      const [id] = this.selectedRowKeys
      this.$refs.schema.edit(id)
    } }
}
</script>

<style lang="less">

</style>
