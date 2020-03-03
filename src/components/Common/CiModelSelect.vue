<template>
  <div class="CiModelSelect">
    <!-- FIXME: 自定义 search 回调 -->
    <a-select
      showSearch
      allowClear
      style="min-width: 200px"
      v-model="_value"
      :notFoundContent="loading ? '加载中...' : '暂无数据'"
      @change="handleChange"
      @select="select"
    >
      <a-select-opt-group v-for="(group) in groups" :key="group.value">
        <span slot="label">{{ group.label }}</span>
        <a-select-option
          v-for="(item, itemIdx) in group.children"
          :key="itemIdx"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select-opt-group>
    </a-select>
  </div>
</template>

<script>
import { getModelList } from '@/api/controller/Resource'

export default {
  name: 'CiModelSelect',
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    groups: [],
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
    async loadData () {
      try {
        this.loading = true
        const { groups } = await getModelList(true)
        this.groups = groups
      } catch (e) {
        this.groups = []
        throw e
      } finally {
        this.loading = false
      }
    },
    handleChange (value) {
      console.log(arguments)
      this._value = value
    },
    select () {
      console.log(arguments)
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="less">
</style>
