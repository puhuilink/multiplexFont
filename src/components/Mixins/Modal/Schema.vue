<script>
import OperationNotification from '@/components/Mixins/OperationNotification'

export default {
  name: 'Schema',
  mixins: [OperationNotification],
  components: {},
  props: {},
  data: (vm) => ({
    // model confirm btn loading
    confirmLoading: false,
    // nested form
    form: vm.$form.createForm(vm),
    formItemLayout: {
      // TODO: responsive
      labelCol: {
        // span: 6
      },
      wrapperCol: {
        span: 23
      }
    },
    // modal visible
    visible: false,
    // model confirm cb
    submit: () => {},
    // modal title
    title: ''
  }),
  computed: {},
  methods: {
    cancel () {
      this.visible = false
    },
    reset () {
      this.form.resetFields()
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    show (title) {
      this.title = title
      this.visible = true
    }
  }
}
</script>

<style lang="less">

</style>
