<template>
  <a-form-item
    :label="field.label"
    v-bind="formItemProps"
    style="width: 100%"
  >
    <a-select
      v-model.number="field.value"
      v-bind="formChildProps"
      showSearch
      allowClear
      style="min-width: 200px"
      :notFoundContent="sourceValueLoading ? '加载中...' : '暂无数据'"
      :filterOption="filterOption"
    >
      <a-select-option
        v-for="(item, itemIdx) in sourceValueList"
        :key="`${itemIdx}-${item.label}`"
        :value="item.values.valueCode"
      >
        {{ item.values.valueLabel }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { InstanceService } from '@/api-hasura/index'
import mixin from './mixin'

export default {
  name: 'SelectedField',
  mixins: [mixin],
  components: {},
  props: {},
  data: () => ({
    sourceValueList: [],
    sourceValueLoading: false
  }),
  methods: {
    filterOption (input, option) {
      const text = option.componentOptions.children[0].text || ''
      return text.toLowerCase().includes(
        input.toLowerCase()
      )
    },
    async loadSourceValueList () {
      try {
        this.sourceValueLoading = true
        const { sourceValue } = this.field
        const { data: { instanceList } } = await InstanceService.find({
          where: {
            name: sourceValue
          },
          fields: [
            '_id',
            'name',
            'label',
            'values'
          ],
          alias: 'instanceList'
        })
        console.log(instanceList)
        this.sourceValueList = instanceList
      } catch (e) {
        this.sourceValueList = []
        throw e
      } finally {
        this.sourceValueLoading = false
      }
    }
  },
  created () {
    this.loadSourceValueList()
  }
}
</script>

<style lang="less">

</style>
