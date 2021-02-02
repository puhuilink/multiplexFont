import { filterOption } from '@/utils/util'
import { Select } from 'ant-design-vue'
import _ from 'lodash'

export default {
  name: 'SelectMixin',
  props: {
    ..._.pick(Select.props, ['disabled']),
    value: {},
    toolTip: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: [Number, String],
      default: ''
    },
    schema: {
      type: String,
      default: 'model',
      validator: schema => ['cmdb', 'model'].includes(schema)
    }
  },
  data: () => ({
    list: [],
    loading: false
  }),
  // TODO: select watch emit empty event
  computed: {
    selectProps () {
      const {
        loading,
        multiple,
        onChange = () => { },
        disabled
      } = this
      return {
        allowClear: true,
        filterOption,
        maxTagCount: 5,
        mode: multiple ? 'multiple' : 'default',
        notFoundContent: loading ? '加载中...' : '暂无数据',
        onChange,
        showSearch: true,
        style: { minWidth: '175px' },
        disabled
      }
    },
    tooltipTitle () {
      // TODO
      // const { list, toolTip } = this
      return ''
    }
  },
  watch: {
    parentId: {
      immediate: true,
      async handler (parentId) {
        await this.$nextTick()
        this.list = []
        parentId && await this.fetch(parentId)
      }
    }
  },
  methods: {
    filterValue (value) {
      const { multiple } = this
      if (multiple) {
        return _.castArray(value).filter(Boolean)
      } else {
        return Array.isArray(value) ? value[0] : value
      }
    },
    reset () {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    fetch (parentId) {},
    change (value, option) {
      const payload = this.filterValue(value)
      this.$emit('change', payload)
      this.$emit('update:value', payload)
      this.$emit('input', payload)
      // https://www.antdv.com/components/form-model-cn/#API
      // Form.Item 会对唯一子元素进行劫持，并监听 blur 和 change 事件，来达到自动校验的目的
      // 此处自定义组件需要触发 blur 来触发 Form.Item 校验
      this.$emit('blur')
    },
    renderSelect () {
      const { change, filterValue, value } = this
      return (
        <a-select {...{ props: this.selectProps }} value={filterValue(value)} onChange={change}>
          { ...this.renderSelectOption() }
        </a-select>
      )
    },
    renderSelectOption () {
      return this.list.map(({ key, label }) => (
        <a-select-option key={key} value={key}>
          { label }
        </a-select-option>
      ))
    },
    renderToolTip () {
      this.$createElement('p', {
        domProps: { innerHTML: this.tooltipTitle },
        slot: 'title'
      })
    }
  },
  render () {
    const { renderSelect, toolTip, tooltipTitle } = this
    const withoutToolTip = renderSelect()
    const withTooltip = (
      <a-tooltip placement="leftTop" title={tooltipTitle}>
        { withoutToolTip }
      </a-tooltip>
    )
    return (
      <div className="SelectMixin">
        { toolTip ? withTooltip : withoutToolTip }
      </div>
    )
  }
}
