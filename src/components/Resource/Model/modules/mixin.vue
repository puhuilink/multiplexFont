<script>
import OperationNotification from '@/components/OperationNotification'

export default {
  mixins: [OperationNotification],
  data: (vm) => ({
    form: vm.$form.createForm(vm),
    title: '新增',
    visible: false
  }),
  methods: {
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
