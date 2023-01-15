<template>
  <div
    style="display: flex;  align-items: center;justify-content: space-between">
    <a-tabs default-active-key="1" style="margin-left: 15px">
      <a-tab-pane key="1" tab="    监控工具   "></a-tab-pane>
    </a-tabs>
    <a-select style="width: 200px;margin-right: 15px" :options="platformOptions" allowClear @change="handleChange" @focus="getPlatformList"> </a-select>
  </div>
</template>

<script>
import store from '@/store/index'
export default {
  name: 'TopGuide',
  data () {
    return {
      platformOptions: []
    }
  },
  methods: {
    getPlatformList () {
      const arr = []
      const entity = store.getters.platformList
      entity.forEach(e => {
        arr.push({
          value: e.platformId,
          label: e.platName
        })
      })
      this.platformOptions = arr
      this.$forceUpdate()
    },
    handleChange (element) {
      this.$emit('platformChange', element)
    }
  },
  mounted () {
    // setTimeout(this.getPlatformList, 1000)
  }
  // TODO 添加props与父组件交互
  // TODO 将style样式全写在下边 以class的形式
}
</script>

<style scoped></style>
