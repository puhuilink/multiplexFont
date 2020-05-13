<script>
import OperationNotification from '@/components/OperationNotification'

export default {
  mixins: [OperationNotification],
  data: (vm) => ({
    form: vm.$form.createForm(vm),
    title: '新增',
    visible: false,
    disableMatchType: true
  }),
  methods: {
    async searchFieldInput (e) {
      // 等待表单数据刷新
      await this.$nextTick()
      this.disableMatchType = !this.form.getFieldValue('searchField')
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
