<!--
 * @Author: your name
 * @Date: 2021-03-22 16:29:11
 * @LastEditTime: 2021-03-23 14:49:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\src\components\BusinessSystemAllList\index.vue
-->
<template>
  <div class="BusinessSystemAllList">
    <div
      class="BusinessSystemAllList__item"
      v-for="(config, index) in content"
      :key="index"
    >
      <BusinessSystemCascader :config="config" />
      <a-button type="link" icon="delete" @click="removeItem(index)" />
      <a-button type="link" icon="snippets" @click="copyItem(index)" />
    </div>
    <a-button type="link" icon="file-add" @click="addItem()" />
  </div>
</template>

<script>
import _ from 'lodash'
import BusinessSystemCascader from '~~~/BusinessSystemCascader/index'
export default {
  name: 'BusinessSystemAllList',
  components: { BusinessSystemCascader },
  props: {
    content: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 删除节点
    removeItem (index) {
      this.content.splice(index, 1)
    },
    // 新增节点
    addItem (item = {
      // 新增节点需要哪些：systemId
      systemId: null,
      hostIds: [],
      endpointModelId: null,
      endpointId: null,
      metricModelId: null,
      metricId: null
    }) {
      this.content.push(item)
    },
    copyItem (index) {
      const targetItem = this.content[index]
      const copyItem = _.cloneDeep(targetItem)
      this.addItem(copyItem)
    }
  }
}
</script>

<style lang="less">
.BusinessSystemAllList {
   &__item {
     display: flex;
     flex-direction: row;
     width: 100%;
   }
}
</style>
