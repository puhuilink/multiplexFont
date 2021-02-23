<template>
  <a-cascader
    class="CascaderDictValue"
    :notFoundContent="loading ? '加载中' : '暂无数据'"
    :options="options"
    placeholder="请选择分类"
    :showSearch="{ filter }"
    :value="value"
    @change="onChange"
  />
</template>

<script>
import { DictValueService } from '@/api/index'

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
        this.options = await DictValueService.treeData()
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
  width: 200px;
}
</style>
