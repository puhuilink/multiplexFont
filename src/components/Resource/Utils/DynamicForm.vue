<script>
import DynamicFormItem, { makeFormItemValue } from './DynamicFormItem'
// import _ from 'lodash'

export default {
  name: 'DynamicForm',
  components: {
    DynamicFormItem
  },
  props: {
    fields: {
      type: Array,
      default: () => ([])
    },
    mode: {
      type: String,
      default: 'add',
      validator: mode => ['add', 'edit'].includes(mode)
    }
  },
  data: (vm) => ({
    form: vm.$form.createForm(vm)
  }),
  methods: {
    async setFieldsValue (value) {
      // 等待 form 挂载
      await this.$nextTick
      const { form, fields } = this
      const formData = {}
      for (const field of fields) {
        const { name } = field
        if (value.hasOwnProperty(name)) {
          formData[name] = makeFormItemValue(field, value[name])
        }
      }
      console.log(formData)
      form.setFieldsValue(formData)
    }
  },
  render (h) {
    const { form, fields, mode } = this
    return (
      <a-form form={form} layout="vertical">
        <a-row>
          {
            ...fields.map((field, index) => (
              <a-col md={12} span={24} key={index}>
                <DynamicFormItem mode={mode} form={form} field={field} />
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
