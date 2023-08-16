<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="集团">
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
import safeSoruce from "./safeSoruce/index.vue";
export default {
  name: 'SafeComb',
  components: {
    safeTouchCopy,
    safeSoruce
  }
}
</script>

<style scoped>

</style>
