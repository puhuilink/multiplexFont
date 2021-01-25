<template>
  <div class="BusinessSystemTreeHealthList">
    <div
      class="BusinessSystemTreeHealthList__item"
      v-for="(config, index) in content"
      :key="index"
    >
      <BusinessSystemTreeHealth :config="config" />
      <a-button type="link" icon="delete" @click="removeItem(index)" />
      <a-button type="link" icon="snippets" @click="copyItem(index)" />
    </div>
    <a-button type="link" icon="file-add" @click="addItem()" />
  </div>
</template>

<script>
import BusinessSystemTreeHealth from '~~~/BusinessSystemTreeHealth'
import _ from 'lodash'

export default {
  name: 'BusinessSystemTreeHealthList',
  mixins: [],
  components: {
    BusinessSystemTreeHealth
  },
  props: {
    content: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  computed: {},
  methods: {
    copyItem (index) {
      const targetItem = this.content[index]
      const copyItem = _.cloneDeep(targetItem)
      this.addItem(copyItem)
    },
    addItem (item = {
      systemId: null,
      systemType: null
    }) {
      this.content.push(item)
    },
    removeItem (index) {
      this.content.splice(index, 1)
    }
  }
}
</script>

<style lang="less">
.BusinessSystemTreeHealthList {
  &__item {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
}
</style>
