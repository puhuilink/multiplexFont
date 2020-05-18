<script>
import DateField from './DateField'

export default {
  name: 'DatetimeField',
  extends: DateField,
  components: {},
  data: () => ({
  }),
  computed: {},
  methods: {},
  render (h) {
    const { $props } = this
    console.log($props)
    return h(DateField, {
      props: {
        ...$props,
        showTime: true
      }
    })
  }
}
</script>

<style lang="less">

</style>
