<template>
  <iframe width="100%" height="100%" ref="childIframe" :src="`https://10.201.20.84/bigdata${link}`" frameborder="0"></iframe>
</template>

<script>
export default {
  name: 'Iframe',
  props: {
    link: {
      type: String,
      required: true
    }
  },
  mounted () {
    const mapFrame = this.$refs['childIframe']
    if (mapFrame.attachEvent) {
      mapFrame.attachEvent('onload', function () {
        mapFrame.contentWindow.postMessage({
          type: 'token',
          data: '123'
        }, '*')
      })
    } else {
      mapFrame.onload = function () {
        mapFrame.contentWindow.postMessage({
          type: 'token',
          data: '123'
        }, '*')
      }
    }
  }
}
</script>

<style scoped>

</style>
