<template>
  <div class="outer abs">
    <plat class="abs" style="left: 52px;top:32px;"></plat>
    <plat class="abs" style="left: 482px;top:32px;"></plat>
    <plat class="abs" style="left: 52px;top:174px;"></plat>
    <plat class="abs" style="left: 482px;top:174px;"></plat>
  </div>
</template>

<script>
import plat from '~~~/Elements/Report/platForm'
export default {
  name: 'ColorMask',
  components: {
    plat
  }
}
</script>

<style scoped>
.outer {
  width: 930px;
  height: 328px;
  background: linear-gradient(360deg, rgba(33,82,139,0.49) 0%, rgba(21,47,87,0) 100%);
  position: relative;
}
.abs {
  position: absolute;
}
</style>
