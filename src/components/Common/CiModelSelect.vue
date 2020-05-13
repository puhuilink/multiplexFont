<template>
  <div class="CiModelSelect">
    <!-- FIXME: 自定义 search 回调 -->
    <a-select
      :labelInValue="labelInValue"
      showSearch
      allowClear
      style="min-width: 200px"
      v-model="_value"
      :notFoundContent="loading ? '加载中...' : '暂无数据'"
      @select="select"
      :filterOption="filterOption"
    >
      <a-select-opt-group v-for="(group, idx) in groups" :key="idx">
        <span slot="label">{{ group.label }}</span>
        <a-select-option
          v-for="(item, itemIdx) in group.children"
          :key="`${itemIdx}-${item.label}`"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select-opt-group>
    </a-select>
  </div>
</template>

<script>
import { ModelService } from '@/api-hasura/index'

export default {
  name: 'CiModelSelect',
  components: {},
  props: {
    // FIXME: v-decorator 无法动态传入？
    decorator: {
      type: Array,
      default: () => (['model', {}])
    },
    // labelInValue 为真时格式为 object，否则为 string
    // eslint-disable-next-line
    value: {
      // type: String,
      // default: ''
    },
    labelInValue: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    groups: [],
    loading: false,
    // 选中项的 label
    label: ''
  }),
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (v = '') {
        // clear 时触发为 空
        const label = v ? this.label : ''
        this.$emit('input', v, label)
      }
    }
  },
  methods: {
    filterOption (input, option) {
      const text = option.componentOptions.children[0].text || ''
      return text.toLowerCase().includes(
        input.toLowerCase()
      )
    },
    async loadData () {
      try {
        this.loading = true
        const { data: { groups } } = await ModelService.find({
          fields: [
            'label',
            'value: name',
            `children {
              label
              value: name
              parentName
            }`
          ],
          'alias': 'groups'
        })
        // const { groups } = await getModelList(true)
        this.groups = groups
      } catch (e) {
        this.groups = []
        throw e
      } finally {
        this.loading = false
      }
    },
    handleChange (value) {
      // console.log(arguments)
      this._value = value
      console.log(value)
    },
    select (value) {
      const { key } = arguments[1].data
      const label = key.split('-').pop()
      // console.log(label)
      // antd 提供了 labelInValue 属性来抛出 label，但这也改变了 value 传值的结构
      // 此处在绑定 key 时记录了 label
      this.$emit('input:label', label)
      this.label = label
      this._value = value
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="less">
</style>
