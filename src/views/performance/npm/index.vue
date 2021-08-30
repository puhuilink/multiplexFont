<template>
  <iframe
    width="100%"
    height="100%"
    ref="childIframe"
    src="http://10.201.51.30/zh-cn/apc/manager/alert/?token=8e6c8bc1b377bf65e1817f2d90a808cc"
    frameborder="0"></iframe>
</template>

<script>
export default {
  name: 'Npm',
  methods: {
    getCookies: function (name) {
      const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
      if (document.cookie.match(reg)) {
        return unescape(reg[2])
      } else {
        return null
      }
    }
  },
  mounted () {}
}
</script>

<style scoped>

</style>
