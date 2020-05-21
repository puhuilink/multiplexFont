<script>
import { InstanceService, ModelService } from '@/api-hasura/index'
import _ from 'lodash'

// 监控对象模型节点
const COMMON_CI = 'CommonCi'

const isCommonCiOrChild = (argus = {}) => {
  const { name = '', parentTree = '' } = argus
  return name.includes(COMMON_CI) || parentTree.includes(COMMON_CI)
}

export default {
  name: 'KpiSelect',
  components: {},
  props: {
    // eslint-disable-next-line
    value: {
      // type: Array,
      // default: () => ([])
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // 所属模型节点，不传时不进行查询（数据量太大）
    'nodeType': {
      type: String,
      default: ''
    },
    labelInValue: {
      type: Boolean,
      default: false
    },
    toolTip: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    options: [],
    loading: false
  }),
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (v) {
        // 为维护字段一致性，对外统一暴露为数组格式
        // 当 multiple 为 true 时，v 为数组；反之为 string 或 undefined (当 allowClaear 触发时)
        const arr = v ? [v] : []
        this.$emit('input', this.multiple ? v : arr)
      }
    },
    tooltipTitle () {
      let kpiList
      try {
        kpiList = this._value.map(value => {
          const { label, values: { kpiCode } } = this.options.find(option => option.values.kpiCode === value)
          return {
            label,
            kpiCode
          }
        })
      } catch (e) {
        kpiList = []
        throw e
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        return kpiList.map(({ label, kpiCode }) => `${label}: ${kpiCode}`).join('<br />')
      }
    }
  },
  watch: {
    nodeType: {
      immediate: true,
      handler (v) {
        // this._value = []
        this.options = []
        if (v) {
          this.loadData()
        }
      }
    }
  },
  methods: {
    /**
       * 加载列表
       * TODO: 数据量较大，可分页加载，向下滑动时分页
       * TODO: 全选
       * @return {Promise<void>}
       */
    async loadData () {
      try {
        this.loading = true
        const { nodeType } = this
        const { data: { modelList: [model] } } = await ModelService.find({
          where: {
            name: nodeType
          },
          fields: [
            'name',
            'parentName',
            'parentTree'
          ],
          alias: 'modelList'
        })
        // FIXME: 监控对象模型节点及其后代节点才能筛选 (待确认)
        if (isCommonCiOrChild(model)) {
          const { name, parentName } = model
          const nodeTypeList = _.uniq([ COMMON_CI, name, parentName ])
          const { data: { options } } = await InstanceService.find({
            where: {
              _or: nodeTypeList.map(nodeType => ({
                parentName: {
                  _eq: 'Kpi'
                },
                values: {
                  _contains: {
                    nodeType: nodeType
                  }
                }
              }))
            },
            fields: [
              'label',
              'values',
              '_id'
            ],
            alias: 'options'
          })
          this.options = options
        } else {
          this.options = []
        }
      } catch (e) {
        this.options = []
        throw e
      } finally {
        this.loading = false
      }
    },
    handleChange (value) {
      // console.log(value)
      this._value = value
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  },
  render (h) {
    const {
      tooltipTitle, filterOption, labelInValue, options,
      multiple, _value, loading, handleChange, toolTip
    } = this

    const selectWithoutTooltip = (
      <a-select
        showSearch
        filterOption={filterOption}
        labelInValue={labelInValue}
        mode={ multiple ? 'multiple' : 'default' }
        allowClear
        value={_value}
        notFoundContent={loading ? '加载中...' : '暂无数据'}
        onChange={handleChange}
        maxTagCount={5}
        style={{ minWidth: '175px' }}
      >
        { ...options.map((option, index) => (
          <a-select-option
            key={index}
            value={option.values.kpiCode}
          >{ option.label || option.values.label }</a-select-option>
        )) }
      </a-select>
    )

    const toolTipText = h('p', {
      domProps: { innerHTML: tooltipTitle },
      slot: 'title'
    })
    const selectWithTooltip = h('ATooltip', {
      props: {
        placement: 'left'
      }
    }, [toolTipText, selectWithoutTooltip])

    return (
      <div className="KpiSelect">
        { (toolTip && tooltipTitle) ? selectWithTooltip : selectWithoutTooltip }
      </div>
    )
  }
}
</script>

<style lang="less">
</style>
