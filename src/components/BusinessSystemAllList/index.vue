<template>
  <div class="BusinessSystemAllList">
    <div
      class="BusinessSystemAllList__item"
      v-for="(config, index) in content"
      :key="index"
    >
      <BusinessSystemItem :config="config" />
      <a-button type="link" icon="delete" @click="removeItem(index)" />
      <a-button type="link" icon="snippets" @click="copyItem(index)" />
    </div>
    <a-button type="link" icon="file-add" @click="addItem()" />
  </div>
</template>

<script>
import _ from 'lodash'
import BusinessSystemItem from '~~~/BusinessSystemItem/index'
export default {
  name: 'BusinessSystemAllList',
  components: { BusinessSystemItem },
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
      // 新增节点需要哪些：systemId、system
      systemId: null
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
