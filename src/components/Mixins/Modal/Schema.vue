<script>
import OperationNotification from '@/components/Mixins/OperationNotification'
import _ from 'lodash'

export default {
  name: 'Schema',
  mixins: [OperationNotification],
  components: {},
  props: {},
  data: (vm) => ({
    formatDate: 'YYYY-MM-dd HH:mm:ss',
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
      this.$emit('close', _.get(this.record, 'state'))
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
