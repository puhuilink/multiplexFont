<template>
  <a-form-item
    label="源值"
    v-bind="formItemProps"
  >
    <a-select
      v-bind="formChildProps"
      showSearch
      allowClear
      style="min-width: 200px"
      :notFoundContent="sourceValueLoading ? '加载中...' : '暂无数据'"
      :filterOption="filterOption"
      v-decorator="[
        'sourceValue'
      ]"
    >
      <a-select-option
        v-for="(item, itemIdx) in sourceValueList"
        :key="`${itemIdx}-${item.label}`"
        :value="item.name"
      >
        {{ item.label }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import mixin from './mixin'
import { InstanceService } from '@/api-hasura/index'
import _ from 'lodash'

export default {
  mixins: [mixin],
  name: 'SourceValue',
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
        const { data: { instanceList } } = await InstanceService.find({
          where: {
            parentName: 'DictManager'
          },
          fields: [
            '_id',
            'name',
            'label'
          ],
          alias: 'instanceList'
        })
        this.sourceValueList = _.uniqWith(instanceList, (v1, v2) => v1.name === v2.name)
      } catch (e) {
        this.sourceValueList = []
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
