<script>
/* eslint-disable no-eval */
import moment from 'moment'
import _ from 'lodash'

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
      required: true
    }
  },
  methods: {
    renderFormItem (field) {
      // eslint-disable-next-line no-unused-vars
      const { labelCol, wrapperCol, renderFormItenChild, getFieldDecorator } = this
      const { label } = field
      // FIXME: 使用 getFieldDecorator 会导致无法输入，可能是 form this 指向问题？
      // { renderFormItenChild(field) }
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
        case 'SELECTED': return renderSelect(field)
        case 'DATE': return renderDate(field)
        case 'DATETIME': return renderDateTime(field)
        case 'TEXTAREA': return renderTextarea(field)
      }
    },
    getFieldDecorator (field) {
      const { form, makeInitialValue } = this
      const { label, name, allowNull, pattern, defaultValue } = field
      const options = {
        ...defaultValue ? {
          initialValue: makeInitialValue(field)
        } : {},
        rules: [
          ...eval(allowNull) ? [{
            required: true,
            message: `${label}必填`
          }] : [],
          ...eval(pattern) ? [{
            pattern,
            messahe: `${label}格式错误`
          }] : []
        ]
      }
      return form.getFieldDecorator(name, options)
    },
    makeInitialValue (field) {
      const { defaultValue, displayType } = field
      switch (displayType) {
        case 'DATE': return moment(defaultValue)
        case 'DATETIME': return moment(defaultValue)
        default: return defaultValue
      }
    },
    renderInput (field) {
      // const { edit } = field
      // FIXME: 数据库数据恒为 false
      // const edit = true
      return <a-input></a-input>
    },
    renderCheckbox (field) {
      return <a-checkbox />
    },
    renderSelect (field) {
      const filterOption = (input, option) => {
        const text = _.get(option, 'componentOptions.children[0].text', '')
        return text.toLowerCase().includes(
          input.toLowerCase()
        )
      }

      const renderSelectOption = itemList => itemList.map(({ label, value }, index) => (
        <a-select-option value={value}>{label}</a-select-option>
      ))

      const renderSelectGroup = groupList => groupList.map(({ label, children, index }) => (
        <a-select-opt-group key={index} label={label}>
          { ...renderSelectOption(children) }
        </a-select-opt-group>
      ))

      // FIMXE: 当数据量庞大时，响应慢，主要表现在 Kpi 下有 3000+ 实例
      const { selectGroupList = [], mappingType = 'one' } = field
      // { ...selectGroupList ? renderSelectGroup(selectGroupList) : renderSelectOption(selectOptionList) }
      return (
        <a-select filterOption={filterOption} showSearch allowClear mode={ mappingType === 'one' ? 'default' : 'multiple' }>
          { ...renderSelectGroup(selectGroupList) }
        </a-select>
      )
    },
    renderTextarea (field) {
      return <a-textarea autosize />
    },
    renderDate (field) {
      return <a-date-picker style={{ width: '100%' }} />
    },
    renderDateTime (field) {
      return <a-date-picker style={{ width: '100%' }} showTime />
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
