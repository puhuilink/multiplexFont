<template>
  <div class="SoruceBox">
    <div v-if="!disabled">
      <a-tabs :default-active-key="'1'">
        <a-tab-pane key="1" tab="集团">
          <safeSoruce></safeSoruce>
        </a-tab-pane>
        <a-tab-pane key="2" tab="二级单位" force-render>
          <safeTouchCopy></safeTouchCopy>
        </a-tab-pane>
      </a-tabs>
    </div>

    <div v-if="disabled">
      <safeTouchCopy></safeTouchCopy>
    </div>
  </div>
</template>

<script>
import safeTouchCopy from '@/views/SecurityMonitoring/view/safeTouchCopy'
import safeSoruce from './safeSoruce/index.vue'
import { axios } from '@/utils/request'

export default {
  name: 'SafeComb',
  components: {
    safeTouchCopy,
    safeSoruce
  },
  data () {
    return {
      disabled: false
    }
  },
  mounted () {
    // 在组件挂载后，发起异步请求加载用户数据
    const navContainer = document.querySelector('.SoruceBox .ant-tabs-nav-container')
    if (navContainer) {
      // 更改高度为 40px
      navContainer.style.cssText = 'height: 60px !important'
    }
  },
  async created () {
    const { data: { dataIds } } = await axios.get('/organize/list', {
      params: {
        isOpen: true
      }
    })
    const organizeIdList = ['77551146956226560', '77551230678728704', '77550822937853952']
    // 检查organizeIdList中的任何一个元素是否存在于originalArray
    const existsInOriginalArray = organizeIdList.some(id => dataIds.includes(id))

    if (existsInOriginalArray) {
    } else {
      this.disabled = true
    }
  }
}
</script>

<style scoped>

</style>
