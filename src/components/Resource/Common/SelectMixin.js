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
    parentId: {
      type: [Number, String],
      default: ''
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
        this.list = []
        this.$emit('change', null)
        this.$emit('update:value', null)
        this.$emit('input', null)
        parentId && await this.fetch(parentId)
      }
    }
  },
  methods: {
    filterValue (value) {
      const { multiple } = this
      if (multiple) {
        return Array.isArray(value) ? value : (value ? [value] : [])
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
      // TODO: 统一从 update 迁移到 input
      // 避免在不同组件间使用 v-model 与 .sync 的碎片化情况
      this.$emit('input', payload)
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
