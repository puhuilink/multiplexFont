<script>
import DynamicFormItem from './DynamicFormItem'

export default {
  name: 'DynamicForm',
  components: {
    DynamicFormItem
  },
  props: {
    fields: {
      type: Array,
      default: () => ([])
    }
  },
  data: (vm) => ({
    form: vm.$form.createForm(vm)
  }),
  render (h) {
    const { form, fields } = this
    return (
      <a-form form={form} layout="vertical">
        <a-row>
          {
            ...fields.map((field, index) => (
              <a-col md={12} span={24} key={index}>
                <DynamicFormItem form={form} field={field} />
              </a-col>
            ))
          }
        </a-row>
      </a-form>
    )
  }
}
</script>

<style lang="less">

</style>
