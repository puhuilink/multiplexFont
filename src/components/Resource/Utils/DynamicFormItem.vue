<script>
/* eslint-disable no-eval */
import moment from 'moment'
import _ from 'lodash'

export const makeFormItemValue = function (field, value) {
  const { displayType = 'TEXT', mappingType = 'one' } = field
  switch (displayType) {
    case 'DATE': return moment(value)
    case 'DATETIME': return moment(value)
    case 'TEXT': return `${value}`
    case 'SELECTED': return mappingType === 'one' ? value : (value ? [value] : [])
    default: return value
  }
}

export default {
  name: 'DynamicFormItem',
  components: {},
  props: {
    labelCol: {
      type: Object,
      default: () => ({ span: 24 })
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
    },
    mode: {
      type: String,
      default: 'add',
      validator: mode => ['add', 'edit'].includes(mode)
    }
  },
  computed: {
    isAdd () {
      return this.mode === 'add'
    }
  },
  methods: {
    renderFormItem (field) {
      // eslint-disable-next-line no-unused-vars
      const { labelCol, wrapperCol, renderFormItenChild, getFieldDecorator } = this
      const { label } = field
      return (
        <a-form-item label={label} labelCol={labelCol} wrapperCol={wrapperCol}>
          { getFieldDecorator(field)(renderFormItenChild(field)) }
        </a-form-item>
      )
    },
    renderFormItenChild (field) {
      // field 有数据类型与显式类型
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
      const { form, isAdd } = this
      const {
        label,
        name,
        // 是否必填
        allowNull = false,
        pattern = '',
        defaultValue
      } = field
      // console.log(pattern)
      const options = {
        initialValue: makeFormItemValue(field, defaultValue),
        rules: [
          ...isAdd && eval(`${allowNull}`) ? [{
            required: true,
            message: `${label}必填`
          }] : [],
          ...(`${pattern}` !== 'null' && `${pattern}` !== 'undefined' && `${pattern}`) ? [{
            pattern: `${pattern}`,
            message: `${label}格式错误`
          }] : []
        ]
      }
      return form.getFieldDecorator(name, options)
    },
    renderInput (field) {
      // TODO: 新增完成后，不允许再次编辑
      // eslint-disable-next-line no-unused-vars
      const { edit = false } = field
      // eslint-disable-next-line no-unused-vars
      const { isAdd } = this
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
        <a-select
          filterOption={filterOption}
          showSearch
          allowClear
          mode={ mappingType === 'one' ? 'default' : 'multiple' }
          notFoundContent="暂无内容"
        >
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
