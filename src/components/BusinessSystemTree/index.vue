<!--
 * @Author: xcs
 * @Date: 2021-03-22 16:29:11
 * @LastEditTime: 2021-03-23 14:05:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\src\components\BusinessSystemTree\index.vue
-->
<template>
  <a-tree-select
    allowClear
    :style="{ minWidth: '300px' }"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择业务系统"
    :replaceFields="{
      title: 'alias',
      key: 'id',
      value: 'id'
    }"
    showSearch
    treeNodeFilterProp="title"
    :treeData="treeData"
    treeDefaultExpandAll
    :value="['', null].includes(value) ? undefined : value"
    @change="$emit('input', $event)"
  ></a-tree-select>
</template>

<script>
import { CmdbService } from '@/api/index'

export default {
  name: 'BusinessSystemTree',
  mixins: [],
  components: {},
  props: {
    value: {
      type: [String, null],
      default: () => ''
    }
  },
  data () {
    return {
      loading: false,
      treeData: []
    }
  },
  computed: {},
  methods: {
    async fetch () {
      // TODO: loading effect
      try {
        this.loading = true
        this.treeData = await CmdbService.healthyTree()
      } catch (e) {
        this.treeData = []
        throw e
      } finally {
        this.loading = false
      }
    }
  },
  created () {
    this.fetch()
  }
}
</script>

<style lang="less">

</style>
