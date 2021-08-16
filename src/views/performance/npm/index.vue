<template>
  <iframe
    width="100%"
    height="100%"
    ref="childIframe"
    src="http://10.201.51.30/zh-cn/apc/manager/alert/?token=8e6c8bc1b377bf65e1817f2d90a808cc;"
    frameborder="0"></iframe>
</template>

<script>
export default {
  name: 'Npm',
  mounted () {
    const d = new Date()
    document.cookie = 'X-CSRFToken=tgGQ0I2IV6bMIK3sz8ArMe6M2HShmNBH; expires=' + d + ';'
  }
}
</script>

<style scoped>

</style>
