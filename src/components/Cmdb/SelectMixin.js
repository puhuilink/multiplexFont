import { filterOption } from '@/utils/util'

export default {
  name: 'SelectMixin',
  props: {
    value: {},
    toolTip: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    list: [],
    loading: false
  }),
  computed: {
    selectProps () {
      const {
        loading,
        multiple,
        onChange = () => {}
      } = this
      return {
        allowClear: true,
        filterOption,
        maxTagCount: 5,
        mode: multiple ? 'multiple' : 'default',
        notFoundContent: loading ? '加载中...' : '暂无数据',
        onChange,
        showSearch: true,
        style: { minWidth: '175px' }
      }
    },
    tooltipTitle () {
      // TODO
      // const { list, toolTip } = this
      return ''
    }
  },
  methods: {
    renderSelect () {
      return (
        <a-select {...this.selectProps}>
          { ...this.renderSelectOption() }
        </a-select>
      )
    },
    renderSelectOption () {
      return this.list.map(({ value, label }) => (
        <a-select-option key={value} value={value}>
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
  render (h) {
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
