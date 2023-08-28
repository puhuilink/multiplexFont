<template>
  <div>
    <a-tabs :default-active-key="disabled?'1':'2'">
      <a-tab-pane key="1" tab="集团" v-if="disabled">
        <safeSoruce></safeSoruce>
      </a-tab-pane>
      <a-tab-pane key="2" tab="二级单位" force-render>
        <safeTouchCopy></safeTouchCopy>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import safeTouchCopy from '@/views/SecurityMonitoring/view/safeTouchCopy'
// import safeTouch from '@/views/SecurityMonitoring/view/safeTouch'
import safeSoruce from './safeSoruce/index.vue'
import { USER } from '@/store/mutation-types'
import Vue from 'vue'
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
  created () {
    const { organizeId } = Vue.ls.get(USER)
    if (organizeId === '77551146956226560' || organizeId === '77551230678728704' || organizeId === '77550822937853952') {
      this.disabled = true
    }
  }
}
</script>

<style scoped>

</style>
