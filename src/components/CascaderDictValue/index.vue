<template>
  <a-cascader
    class="CascaderDictValue"
    :notFoundContent="loading ? '加载中' : '暂无数据'"
    :options="options"
    :showSearch="{ filter }"
    @change="onChange"
  />
</template>

<script>
import { DictValueService } from '@/api/index'

const itemOnDictValue = `
  label: value_label
  value: value_code
`

export default {
  name: 'CascaderDictValue',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: false,
      options: []
    }
  },
  methods: {
    async fetch () {
      try {
        this.loading = true
        const { data: { options } } = await DictValueService.find({
          where: { value_param: { _eq: '1' } },
          alias: 'options',
          fields: [
            `${itemOnDictValue},
              children {
              ${itemOnDictValue}
              children {
                ${itemOnDictValue}
              }
            }`
          ]
        })
        this.options = options
      } catch (err) {
        this.options = []
        throw err
      } finally {
        this.loading = false
      }
    },
    filter (inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    onChange (value) {
      this.$emit('change', value)
    }
  },
  created () {
    this.fetch()
  }
}
</script>

<style lang="less">
.CascaderDictValue {
  width: 300px;
}
</style>
