export default {
  props: {
    plan: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    value: {
      get () {
        return this.plan
      },
      set (value) {
        this.$emit('update:plan', value)
      }
    }
  }
}
