<script>
import OperationNotification from '@/components/OperationNotification'

export default {
  mixins: [OperationNotification],
  data: (vm) => ({
    form: vm.$form.createForm(vm),
    title: '新增',
    visible: false,
    disableMatchType: true,
    disableSourceType: true
  }),
  methods: {
    async initForm () {
      await this.$nextTick()
      this.searchFieldInput()
      this.displayTypeSelect()
    },
    async searchFieldInput (e) {
      // 等待表单数据刷新
      await this.$nextTick()
      this.disableMatchType = !this.form.getFieldValue('searchField')
    },
    async displayTypeSelect () {
      await this.$nextTick()
      if (this.form.getFieldValue('displayType') === 'SELECTED') {
        this.disableSourceType = false
        // TODO: matchType
      } else {
        this.disableSourceType = true
      }
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
</script>

<style lang="less">
  .ModelSchema {
    &__modal {
      .ant-modal-body {
        height: 415px;
        overflow: scroll;
      }
    }
  }
</style>
