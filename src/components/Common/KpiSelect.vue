<template>
  <div class="KpiSelect">
    <a-select
      :labelInValue="labelInValue"
      mode="multiple"
      style="min-width: 200px"
      :value="_value"
      :notFoundContent="loading ? '加载中...' : '暂无数据'"
      @change="handleChange"
    >
      <a-select-option
        v-for="(item, itemIdx) in options"
        :key="itemIdx"
        :value="item.rid"
      >
        {{ item.label }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { getKpiSelectList } from '@/api/controller/Resource'

export default {
  name: 'KpiSelect',
  components: {},
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    // 父节点，不传时不进行查询（数据量太大）
    'nodetypeS': {
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
        this.$emit('input', v)
      }
    }
  },
  watch: {
    nodetypeS: {
      immediate: true,
      handler (v) {
        // this._value = []
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
        const { data } = await getKpiSelectList(this.nodetypeS)
        this.options = data
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
    }
  }
}
</script>

<style lang="less">
</style>
