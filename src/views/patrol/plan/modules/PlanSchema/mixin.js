export default {
  props: {
    plan: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    _value: {
      get () {
        return this.plan
      },
      set (value) {
        this.$emit('update:plan', value)
      }
    }
  }
}
