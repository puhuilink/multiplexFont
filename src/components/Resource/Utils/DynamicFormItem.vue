<script>
export default {
  name: 'DynamicFormItem',
  components: {},
  props: {
    labelCol: {
      type: Object,
      default: () => ({ span: 6 })
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 23 })
    },
    field: {
      type: Object,
      required: true,
      default: () => ({})
    },
    form: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data: (vm) => ({
    fields: []
  }),
  computed: {},
  methods: {
    renderFormItem (field) {
      const { labelCol, wrapperCol, renderFormItenChild, getFieldDecorator } = this
      const { label } = field
      return (
        <a-form-item label={label} labelCol={labelCol} wrapperCol={wrapperCol}>
          { getFieldDecorator(field)(renderFormItenChild(field)) }
        </a-form-item>
      )
    },
    renderFormItenChild (field) {
      // field 有数据类型与显式类型之分
      const { displayType = 'TEXT' } = field
      const {
        renderInput,
        renderCheckbox,
        renderSelect,
        renderDate,
        renderDateTime,
        renderTextarea
      } = this
      switch (displayType) {
        case 'TEXT': return renderInput(field)
        case 'CHECKBOX': return renderCheckbox(field)
        case 'SELECT': return renderSelect(field)
        case 'DATE': return renderDate(field)
        case 'DATETIME': return renderDateTime(field)
        case 'TEXTAREA': return renderTextarea(field)
      }
    },
    getFieldDecorator (field) {
      const { form } = this
      const { label, name, defaultValue, allowNull, pattern } = field
      const options = {
        initialValue: defaultValue,
        id: name,
        rules: [
          ...allowNull ? [{
            required: true,
            message: `${label}必填`
          }] : [],
          ...pattern ? [{
            pattern,
            messahe: `${label}格式错误`
          }] : []
        ]
      }
      return form.getFieldDecorator(name, options)
    },
    renderInput (field) {
      // const { edit } = field
      // FIXME: 数据库数据恒为 false
      const edit = true
      return <a-input disabled={!edit}></a-input>
    },
    renderCheckbox (field) {
      const { defaultValue } = field
      return <a-checkbox defaultValue={defaultValue} />
    },
    renderSelect (field) {
      return <a-select></a-select>
    },
    renderTextarea (field) {
      const { defaultValue } = field
      return <a-textarea defaultValue={defaultValue} autosize />
    },
    renderDate (field) {
      const { defaultValue } = field
      return <a-date-picker style={{ width: '100%' }} defaultValue={defaultValue} />
    },
    renderDateTime (field) {
      const { defaultValue } = field
      return <a-date-picker style={{ width: '100%' }} defaultValue={defaultValue} showTime />
    },
    renderRadio (field) {}
  },
  render (h) {
    const { field, renderFormItem } = this
    return renderFormItem(field)
  }
}
</script>

<style lang="less">

</style>
