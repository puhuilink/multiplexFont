<template>
  <div class="KpiSelect">
    <a-select
      showSearch
      :filterOption="filterOption"
      :labelInValue="labelInValue"
      :mode="multiple ? 'multiple' : 'default'"
      allowClear
      style="min-width: 200px"
      :value="_value"
      :notFoundContent="loading ? '加载中...' : '暂无数据'"
      @change="handleChange"
      :maxTagCount="5"
    >
      <a-select-option
        v-for="(item, itemIdx) in options"
        v-if="item.label"
        :key="itemIdx"
        :value="item.values.kpiCode"
      >
        {{ item.label }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
// import { getKpiSelectList } from '@/api/controller/Resource'
import { InstanceService, ModelService } from '@/api-hasura/index'
import _ from 'lodash'

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
        // hack: nodeType 应该传入选中模型的 parntName，但应用传入了模型的 name，后期统一调整
        const { nodeType } = this
        const { data: { modelList: [model] } } = await ModelService.find({
          where: {
            name: nodeType
          },
          fields: [
            'parentName'
          ],
          alias: 'modelList'
        })
        const { parentName } = model
        const nodeTypeList = _.uniq(['CommonCi', parentName]).filter(v => !!v)
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
  }
}
</script>

<style lang="less">
</style>
