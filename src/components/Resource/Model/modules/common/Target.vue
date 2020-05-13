<template>
  <a-form-item
    label="目标"
    v-bind="formItemProps"
  >
    <!-- TODO: 接受值 -->
    <a-select
      showSearch
      allowClear
      style="min-width: 200px"
      :notFoundContent="targetLoading ? '加载中...' : '暂无数据'"
      :filterOption="filterOption"
      v-decorator="[
        'target',
        { rules: [{ required: true, message: '目标必填' }] },
      ]"
    >
      <a-select-opt-group v-for="(target, idx) in targetList" :key="idx">
        <span slot="label">{{ target.label }}</span>
        <a-select-option
          v-for="(item, itemIdx) in target.children"
          :key="`${itemIdx}-${item.label}`"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select-opt-group>
    </a-select>
  </a-form-item>
</template>

<script>
import mixin from './mixin'
import { ModelService } from '@/api-hasura/index'

export default {
  mixins: [mixin],
  name: 'Order',
  data: () => ({
    targetList: [],
    targetLoading: false
  }),
  methods: {
    filterOption (input, option) {
      const text = option.componentOptions.children[0].text || ''
      return text.toLowerCase().includes(
        input.toLowerCase()
      )
    },
    async loadTarget () {
      try {
        this.targetLoading = true
        const { data: { targetList } } = await ModelService.find({
          fields: [
            'label',
            'value: name',
            `children {
              label
              value: name
              parentName
            }`
          ],
          'alias': 'targetList'
        })
        this.targetList = targetList
      } catch (e) {
        this.targetList = []
        throw e
      } finally {
        this.targetLoading = false
      }
    }
  },
  created () {
    this.loadTarget()
  },
  updated () {
    // this.loadTarget()
  }
}
</script>

<style lang="less">

</style>
