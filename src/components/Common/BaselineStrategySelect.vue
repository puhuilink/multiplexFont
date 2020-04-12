<template>
  <div class="BaselineStrategySelect">
    <a-select
      allowClear
      style="min-width: 200px"
      v-model="_value"
      :notFoundContent="loading ? '加载中...' : '暂无数据'"
      @change="handleChange"
    >
      <a-select-option
        v-for="(item, itemIdx) in options"
        :key="itemIdx"
        :value="item.value"
      >
        {{ item.label }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { getAllBaselinePolicyList } from '@/api/controller/BaselinePolicy'

export default {
  name: 'BaselineStrategySelect',
  components: {},
  props: {
    value: {
      type: String,
      default: ''
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
      set (v = '') {
        this.$emit('input', v)
      }
    }
  },
  methods: {
    /**
       * 加载列表
       * TODO: 数据量较大，可分页加载，向下滑动时分页
       * TODO: 全选
       * @param query
       * @return {Promise<void>}
       */
    async loadData (query = {}) {
      try {
        this.loading = true
        const { data } = await getAllBaselinePolicyList(query)
        this.options = data
      } catch (e) {
        this.options = []
        throw e
      } finally {
        this.loading = false
      }
    },
    handleChange (value = '') {
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
