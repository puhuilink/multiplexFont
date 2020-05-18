<script>
import OperationNotification from '@/components/OperationNotification'

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
    // modal visible
    visible: false,
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
    show () {
      this.visible = true
    }
  }
}
</script>

<style lang="less">

</style>
